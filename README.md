# Iguassu Express Hotel

Projeto institucional completo do Iguassu Express Hotel com frontend premium, painel administrativo protegido, Prisma ORM, PostgreSQL e integração de reservas via Omnibees.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL
- NextAuth com credenciais para o admin
- Upload de imagens e arquivos com suporte a Vercel Blob e fallback local

## Principais recursos

- Home institucional moderna com hero premium, glassmorphism e destaque para reserva direta
- Busca integrada com Omnibees usando `formatDateToOmnibees`, `validateReservationData`, `buildOmnibeesUrl` e `redirectToOmnibees`
- Páginas públicas:
  - `/`
  - `/apartamentos`
  - `/restaurante`
  - `/galeria-de-fotos`
  - `/tour-360`
  - `/localizacao`
  - `/sobre-o-hotel`
  - `/contato`
  - `/blog`
  - `/blog/[slug]`
  - `/trabalhe-conosco`
- Painel admin com rotas:
  - `/admin/login`
  - `/admin/dashboard`
  - `/admin/paginas`
  - `/admin/quartos`
  - `/admin/restaurante`
  - `/admin/galeria`
  - `/admin/tour-360`
  - `/admin/localizacao`
  - `/admin/contato`
  - `/admin/blog`
  - `/admin/faq`
  - `/admin/trabalhe-conosco`
  - `/admin/seo`
  - `/admin/configuracoes`
- FAQ administrável
- Blog com SEO por post
- Gestão de vagas e candidaturas com upload de currículo
- Sitemap, robots, metadata por página e estrutura pronta para SEO local

## Variáveis de ambiente

Use o arquivo `.env.example` como base.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require&pgbouncer=true&connect_timeout=15"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@iguassuexpresshotel.com.br"
ADMIN_PASSWORD="ChangeThisStrongPassword123!"
BLOB_READ_WRITE_TOKEN=""
```

## Ambiente local

1. Instale as dependências:

```bash
npm install
```

2. Configure a `DATABASE_URL` do Neon no `.env`.

3. Gere o banco:

```bash
npm run db:push
```

4. Popule o conteúdo inicial:

```bash
npm run db:seed
```

5. Rode o projeto:

```bash
npm run dev
```

## Build e qualidade

```bash
npm run lint
npm run typecheck
npm run build
```

## Login administrativo

O primeiro usuário admin é criado pelo seed a partir de:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Deploy no Vercel com Neon

1. Suba o projeto para o GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente na Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN` se quiser upload persistente em produção
4. Defina o banco Neon já migrado com `npm run db:push` e `npm run db:seed`.
5. Após a importação do repositório, cada `git push` na branch conectada gera deploy automático na Vercel.

## Observações

- Quando a `DATABASE_URL` ainda estiver com placeholder, o projeto usa fallbacks para conseguir buildar e renderizar a estrutura inicial.
- Em produção, o ideal é habilitar `BLOB_READ_WRITE_TOKEN` para armazenar uploads fora do filesystem temporário da Vercel.
