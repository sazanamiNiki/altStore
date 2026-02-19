import"./hoisted.ake4XmPN.js";import"./hoisted.mGvHz-GO.js";function d(){if(document.getElementById("lightbox-modal"))return;const e=document.createElement("div");e.id="lightbox-modal",e.className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 hidden",e.innerHTML=`
      <div class="relative max-w-screen-lg max-h-screen p-4">
        <button id="lightbox-close" class="absolute -top-3 -right-3 text-white bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-900 transition-colors">
          <span class="material-symbols-outlined" style="font-size:18px">close</span>
        </button>
        <img id="lightbox-img" src="" alt="" class="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
      </div>
    `,document.body.appendChild(e),document.getElementById("lightbox-close")?.addEventListener("click",l),e.addEventListener("click",t=>{t.target===e&&l()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&l()})}function i(e,t){const n=document.getElementById("lightbox-modal"),o=document.getElementById("lightbox-img");n&&o&&(o.src=e,o.alt=t,n.classList.remove("hidden"),document.body.style.overflow="hidden")}function l(){const e=document.getElementById("lightbox-modal");e&&(e.classList.add("hidden"),document.body.style.overflow="")}d();document.querySelectorAll("[data-lightbox]").forEach(e=>{e.addEventListener("click",()=>i(e.src,e.alt))});
