const PRODUCTS = [
  {sku:"CHO-001",name:"Milk Chocolate",thai:"มิลค์ช็อกโกแลต",desc:"รสนุ่มละมุน หอมโกโก้และนม",price:59,image:"images/milk-chocolate.svg",tag:"BEST SELLER"},
  {sku:"CHO-002",name:"Dark Chocolate",thai:"ดาร์กช็อกโกแลต",desc:"รสเข้มข้น สำหรับคนรักโกโก้",price:69,image:"images/dark-chocolate.svg",tag:"RICH & DEEP"}
];
const cfg=window.CHOCO_CONFIG||{API_URL:"",CURRENCY:"฿"};
let cart=JSON.parse(localStorage.getItem("chocoCart")||"{}");
const $=s=>document.querySelector(s);
const money=n=>(cfg.CURRENCY||"฿")+Number(n).toLocaleString("th-TH");
function saveCart(){localStorage.setItem("chocoCart",JSON.stringify(cart));renderCart()}
function renderProducts(){
  $("#productGrid").innerHTML=PRODUCTS.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}"></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.thai} · ${p.desc}</p></div><span class="price">${money(p.price)}</span></div><button class="add-button" data-add="${p.sku}">เพิ่มลงตะกร้า ＋</button></article>`).join("");
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>{const sku=b.dataset.add;cart[sku]=(cart[sku]||0)+1;saveCart();openCart();}));
}
function cartLines(){return PRODUCTS.filter(p=>cart[p.sku]>0).map(p=>({...p,qty:cart[p.sku]}))}
function total(){return cartLines().reduce((s,p)=>s+p.price*p.qty,0)}
function renderCart(){
 const lines=cartLines();$("#cartCount").textContent=lines.reduce((s,p)=>s+p.qty,0);
 $("#cartItems").innerHTML=lines.length?lines.map(p=>`<div class="cart-row"><div><b>${p.name}</b><small>${p.sku} · ${money(p.price)} / ชิ้น</small><small>รวม ${money(p.price*p.qty)}</small></div><div class="qty-controls"><button data-dec="${p.sku}" aria-label="ลดจำนวน">−</button><span>${p.qty}</span><button data-inc="${p.sku}" aria-label="เพิ่มจำนวน">+</button></div></div>`).join(""):'<p class="empty">ยังไม่มีสินค้าในตะกร้า</p>';
 $("#cartTotal").textContent=money(total());$("#checkoutTotal").textContent=money(total());
 document.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{cart[b.dataset.inc]++;saveCart()});
 document.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const k=b.dataset.dec;cart[k]--;if(cart[k]<=0)delete cart[k];saveCart()});
}
function openCart(){$("#cartDrawer").classList.add("open");$("#backdrop").classList.add("open")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#backdrop").classList.remove("open")}
$("#cartToggle").onclick=openCart;$("#closeCart").onclick=closeCart;$("#backdrop").onclick=closeCart;
$("#checkoutButton").onclick=()=>{if(!cartLines().length)return;closeCart();$("#checkoutModal").classList.add("open");$("#checkoutMessage").textContent=""};
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("open");
$("#checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")$("#checkoutModal").classList.remove("open")});
async function sendOrder(payload){
 if(!cfg.API_URL){const orders=JSON.parse(localStorage.getItem("chocoDemoOrders")||"[]");orders.push(payload);localStorage.setItem("chocoDemoOrders",JSON.stringify(orders));return {ok:true,orderId:payload.orderId,demo:true};}
 const response=await fetch(cfg.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"createOrder",order:payload})});
 if(!response.ok)throw new Error("เชื่อมต่อระบบไม่สำเร็จ");
 const data=await response.json();if(!data.ok)throw new Error(data.error||"บันทึกคำสั่งซื้อไม่สำเร็จ");return data;
}
$("#checkoutForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!cartLines().length)return;
 const btn=$("#placeOrder"),msg=$("#checkoutMessage");btn.disabled=true;btn.textContent="กำลังบันทึกคำสั่งซื้อ…";msg.textContent="";
 const fd=new FormData(e.currentTarget),items=cartLines();
 const order={orderId:"CH"+Date.now().toString().slice(-9),createdAt:new Date().toISOString(),customerName:fd.get("customerName").trim(),phone:fd.get("phone").trim(),address:fd.get("address").trim(),note:fd.get("note").trim(),items:items.map(p=>({sku:p.sku,name:p.name,qty:p.qty,unitPrice:p.price,lineTotal:p.qty*p.price})),total:total(),status:"รอหยิบสินค้า"};
 try{const result=await sendOrder(order);msg.textContent=`สั่งซื้อสำเร็จ! เลขที่คำสั่งซื้อ ${result.orderId||order.orderId}`;msg.className="form-message";cart={};saveCart();e.currentTarget.reset();setTimeout(()=>{$("#checkoutModal").classList.remove("open");msg.textContent=""},3500);}
 catch(err){msg.textContent=err.message+" หากเป็นโหมดทดลอง คำสั่งซื้อจะเก็บไว้ในเบราว์เซอร์นี้";msg.className="form-message error";}
 finally{btn.disabled=false;btn.textContent="ยืนยันคำสั่งซื้อ";}
});
renderProducts();renderCart();
