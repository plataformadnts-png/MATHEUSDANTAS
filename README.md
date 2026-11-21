# MAXVITTA LABS — Loja (site estático)

Site em HTML, CSS e JS puros, sem build. Pode ser publicado direto no Cloudflare Pages.

## Páginas
- `index.html`: banner rotativo, categorias, loja com filtro e busca, "como funciona", sobre, blog e perguntas frequentes
- `produto.html?p=ID`: página de cada produto
- `orcamento.html`: lista e formulário que gera o pedido e envia pelo WhatsApp
- `blog.html` e `blog/*.html`: 7 artigos com fontes

## Editar produtos e WhatsApp
Tudo fica em `assets/js/data.js`: o número do WhatsApp, as categorias e a lista de produtos (as imagens ficam em `assets/img/p/`).

## Trocar os banners
Os banners estão em `index.html`, cada um em um `<div class="slide ...">`. Para usar uma arte pronta (1920 × 720), troque o conteúdo do slide por:

    <a href="#loja"><img src="assets/img/banner-1.jpg" alt="Descrição" style="width:100%;height:100%;object-fit:cover"></a>

## Pendências [A DEFINIR]
Os dados de envio, CNPJ, e-mail, Instagram e o registro ou notificação de cada produto.
