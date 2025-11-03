
// Simple static marketplace logic
let products = [];
const productGrid = document.getElementById('productGrid');
const brandFilter = document.getElementById('brandFilter');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

async function loadProducts(){
  const res = await fetch('products.json');
  products = await res.json();
  populateBrandFilter();
  renderProducts();
}

function populateBrandFilter(){
  const brands = Array.from(new Set(products.map(p=>p.brand))).sort();
  brands.forEach(b=>{
    const opt = document.createElement('option'); opt.value=b; opt.textContent=b;
    brandFilter.appendChild(opt);
  });
}

function renderProducts(){
  productGrid.innerHTML='';
  const q = searchInput.value.toLowerCase().trim();
  const brand = brandFilter.value;
  const category = categoryFilter.value;
  const sort = sortSelect.value;

  let list = products.filter(p=>{
    if(brand && p.brand!==brand) return false;
    if(category && p.category!==category) return false;
    if(q && !(p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) return false;
    return true;
  });

  if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);

  list.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="meta"><h4>${p.title}</h4><div class="badge">${p.brand}</div></div>
      <p class="muted" style="color:#6b7280;font-size:13px;margin:0">${p.description}</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="price">$${p.price.toFixed(2)}</div>
        <div><button data-id="${p.id}" class="viewBtn">View</button></div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  // attach handlers
  document.querySelectorAll('.viewBtn').forEach(b=>b.addEventListener('click', (e)=>{
    const id = e.currentTarget.dataset.id;
    openProductModal(id);
  }));
}

function openProductModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  modalBody.innerHTML = `
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <img style="width:280px;height:360px;object-fit:cover;border-radius:8px" src="${p.image}" alt="${p.title}">
      <div style="flex:1;min-width:240px">
        <h2 style="margin-top:0">${p.title}</h2>
        <p style="color:#6b7280">${p.brand} • ${p.category}</p>
        <p>${p.description}</p>
        <p style="font-weight:700;font-size:18px">$${p.price.toFixed(2)}</p>
        <p><strong>Sizes shown:</strong> ${p.available_sizes.join(', ')}</p>
        <div style="margin-top:12px;display:flex;gap:8px">
          <a class="buy-btn" href="${p.affiliate_link}" target="_blank" rel="noopener noreferrer">Buy at ${p.brand}</a>
          <button id="copyLink">Copy affiliate link</button>
        </div>
        <p style="color:#6b7280;font-size:13px;margin-top:12px">Note: This demo uses sample affiliate links. For production, integrate real affiliate/partner links or use your own redirect/tracking.</p>
      </div>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');
  document.getElementById('copyLink').addEventListener('click', ()=>{
    navigator.clipboard.writeText(p.affiliate_link).then(()=>alert('Link copied to clipboard'));
  });
}

closeModal.addEventListener('click', ()=>modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

[brandFilter, categoryFilter, searchInput, sortSelect].forEach(el=>el.addEventListener('change', renderProducts));
searchInput.addEventListener('input', renderProducts);

// onboarding modal
document.getElementById('onboardBtn').addEventListener('click', ()=>{
  alert("Brand onboarding:\n\nEmail us at partnerships@tallandslim.example (replace with your real email).\n\nSuggested pitch: 'Hi — I'm building Tall & Slim, a curated marketplace for tall/slim consumers. We'd like to feature your tall sizes and discuss a revenue share.'");
});

loadProducts();
