/* Catálogo MAXVITTA LABS — produtos sem preço (pedido por orçamento).
   Para adicionar um produto, copie um bloco e ajuste os campos. */
window.MX_CONFIG = {
  whatsapp: "554498185128", // WhatsApp de atendimento (+55 44 9818-5128)
  email: "",               // ex.: "contato@maxvitta.com.br"
  freteGratisAcima: null   // sem preços nesta fase
};

window.MX_CATEGORIES = [
  { id: "concentrados", name: "Concentrados", desc: "Frascos com acabamento prata e filetes dourados." },
  { id: "dermocosmetica", name: "Dermocosmética", desc: "Séruns e essências para a rotina de cuidados." }
];

window.MX_PRODUCTS = [
  { id: "elixir-bio-renovacao", cat: "concentrados", name: "Elixir Bio-Renovação", line: "Linha de concentrados", img: "vial-elixir.webp", tag: "Destaque" },
  { id: "serum-iluminador", cat: "concentrados", name: "Sérum Iluminador", line: "Linha de concentrados", img: "vial-serum.webp" },
  { id: "essencia-firmadora", cat: "concentrados", name: "Essência Firmadora", line: "Linha de concentrados", img: "vial-essencia.webp" },
  { id: "complexo-revitalizante", cat: "concentrados", name: "Complexo Revitalizante", line: "Linha de concentrados", img: "vial-complexo.webp" },
  { id: "concentrado-nutritivo", cat: "concentrados", name: "Concentrado Nutritivo", line: "Linha de concentrados", img: "vial-concentrado.webp" },
  { id: "serum-vitamina-c10", cat: "dermocosmetica", name: "Sérum Vitamina C10", line: "Séruns faciais", img: "serum-vitamina-c10.webp", soft: true, tag: "Novo" },
  { id: "serum-b5-acido-hialuronico", cat: "dermocosmetica", name: "Sérum B5 Ácido Hialurônico", line: "Séruns faciais", img: "serum-b5-acido-hialuronico.webp", soft: true },
  { id: "serum-retinol-b3", cat: "dermocosmetica", name: "Sérum Retinol B3", line: "Séruns faciais", img: "serum-retinol-b3.webp", soft: true },
  { id: "essencia-iluminadora-niacinamida", cat: "dermocosmetica", name: "Essência Iluminadora de Niacinamida", line: "Linha holográfica", img: "essencia-niacinamida.webp", photo: true }
];

/* Artigos do blog ligados a cada produto */
window.MX_ARTICLES = {
  "serum-vitamina-c10": [["vitamina-c-na-pele", "Vitamina C na pele: antioxidante potente, fórmula exigente"]],
  "serum-b5-acido-hialuronico": [["acido-hialuronico-hidratacao", "Ácido hialurônico tópico: o que ele faz de verdade"]],
  "serum-retinol-b3": [["retinol-e-fotoenvelhecimento", "Retinol: o clássico da vitamina A em versão cosmética"], ["niacinamida-vitamina-b3", "Niacinamida: a vitamina B3 que conquistou a dermocosmética"]],
  "essencia-iluminadora-niacinamida": [["niacinamida-vitamina-b3", "Niacinamida: a vitamina B3 que conquistou a dermocosmética"]]
};
