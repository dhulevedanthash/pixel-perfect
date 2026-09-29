<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Site data (shop settings, categories, products, offers, gallery, enquiries) is read through typed query helpers in `src/lib/shop.ts`; components never call Supabase tables directly for reads. Keeps caching and types in one place.
- Product/category/offer/gallery images are stored as URL text fields (local `/images/...` or external links), not uploads — public storage buckets are blocked on this project.
- Admin screens live in `src/components/admin/*` panels rendered by `src/routes/admin.index.tsx`; `/admin/login` handles email+password sign-in. This is a catalog site: no cart, checkout, payments or customer accounts.
