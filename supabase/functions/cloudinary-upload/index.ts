import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY");
    const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary credentials are not configured");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      throw new Error("No file provided");
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64File = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUri = `data:${file.type};base64,${base64File}`;

    // Generate timestamp and signature for Cloudinary
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      timestamp: timestamp.toString(),
      folder: "products", // Optional: organize uploads in folders
    };

    // Create signature
    const encoder = new TextEncoder();
    const paramsString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    
    const signatureString = `${paramsString}${CLOUDINARY_API_SECRET}`;
    const sha1Hash = await crypto.subtle.digest("SHA-1", encoder.encode(signatureString));
    const signature = Array.from(new Uint8Array(sha1Hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    // Prepare form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", dataUri);
    cloudinaryFormData.append("api_key", CLOUDINARY_API_KEY);
    cloudinaryFormData.append("timestamp", timestamp.toString());
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("folder", "products");

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const result = await response.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in cloudinary-upload function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});