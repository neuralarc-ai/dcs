-- 1. DROP OLD RESTRICTIVE POLICIES
drop policy if exists "Allow public read access" on tenders;
drop policy if exists "Allow public read access" on submitted_tenders;
drop policy if exists "Allow public insert" on requirements_submissions;

-- 2. ENABLE FULL ACCESS FOR ADMIN FEATURES
-- (Since we handle security via PIN in the app, we open DB access for the app to use)

-- Allow Admin to Create, Update, Delete Tenders
create policy "Enable all access for tenders" 
on tenders for all 
using (true) 
with check (true);

-- Allow Admin to Complete Tenders (Insert into submitted)
create policy "Enable all access for submitted_tenders" 
on submitted_tenders for all 
using (true) 
with check (true);

-- Allow Admin to View Incoming Requests & Client to Submit
create policy "Enable all access for requirements_submissions" 
on requirements_submissions for all 
using (true) 
with check (true);

-- Allow full access to app settings just in case
drop policy if exists "Allow public read access" on app_settings;
create policy "Enable all access for app_settings" 
on app_settings for all 
using (true) 
with check (true);

-- 3. (Optional) Store Admin PIN in DB instead of hardcoding
insert into app_settings (key, value) 
values ('admin_pin', '0000') 
on conflict (key) do nothing;

