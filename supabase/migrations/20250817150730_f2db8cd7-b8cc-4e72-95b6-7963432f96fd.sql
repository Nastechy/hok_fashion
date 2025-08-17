-- Make joyibini@gmail.com (Joy) an admin
INSERT INTO public.user_roles (user_id, role) 
VALUES ('7a097a34-3827-445f-9bb8-117e41f04239', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;