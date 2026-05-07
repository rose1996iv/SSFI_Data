insert into public.members (
  id,
  full_name,
  email,
  university,
  major,
  batch,
  year_joined,
  current_position,
  state_in_india,
  village_in_myanmar,
  status
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'SSFI Demo President',
    'president@ssfi.org',
    'Christ University',
    'Data Science',
    '2020',
    2020,
    'President',
    'Karnataka',
    'Tedim',
    'active'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'SSFI Demo Secretary',
    'secretary@ssfi.org',
    'Savitribai Phule Pune University',
    'Mechanical Engineering',
    '2019',
    2019,
    'General Secretary',
    'Maharashtra',
    'Kalemyo',
    'active'
  )
on conflict (email) do nothing;
