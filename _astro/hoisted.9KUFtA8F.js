import"./hoisted.mGvHz-GO.js";let s=0,r,l=[];async function y(){const a=document.getElementById("featured-apps-mobile"),t=document.getElementById("featured-apps-desktop"),o=document.getElementById("dots-container"),i=document.getElementById("apps-loading"),d=document.getElementById("apps-content");try{l=(await(await fetch("https://script.google.com/macros/s/AKfycbxcaYOnyNaovd0ERTnVKKRxZP0x4eWSftKk-mMVCXZrbuQDw8e-aPN9sj4dSDPoGYeBsg/exec")).json()).apps.slice(0,3),l.forEach((n,m)=>{const x=(n.distributionInfo?.category||"sideload")==="official"?'<span class="inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-md ml-1">App Store配信</span>':'<span class="inline-block bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-md ml-1">IPA配布</span>',u=`
            <div class="flex items-start gap-4">
              <img src="${n.iconURL}" alt="${n.name}" class="w-20 h-20 rounded-[22%] border border-gray-100 shadow-sm flex-shrink-0">
              <div class="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <h3 class="font-bold text-lg text-gray-900 leading-tight line-clamp-1">${n.name}</h3>
                  <p class="text-sm text-gray-500 mb-2">${n.developerName}</p>
                </div>
                <div class="space-y-2">
                  <a href="${n.downloadURL}" class="block w-full bg-[#007AFF] text-white font-bold text-sm px-5 py-2 rounded-full text-center hover:bg-blue-600 transition shadow-sm" download>ダウンロード</a>
                </div>
                <div class="flex flex-wrap items-center gap-1 col-span-2">
                  <span class="inline-block bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-md">${n.category}</span>
                  ${x}
                </div>
              </div>
            </div>
          `;if(a){const e=document.createElement("div");e.className="app-card flex flex-col flex-shrink-0 w-full max-w-md mx-auto",e.innerHTML=u,a.appendChild(e)}if(t){const e=document.createElement("div");e.className="app-card flex flex-col",e.innerHTML=u,t.appendChild(e)}if(o){const e=document.createElement("button");e.className="w-2 h-2 rounded-full transition-all duration-300 "+(m===0?"bg-blue-600 w-8":"bg-gray-300"),e.addEventListener("click",()=>c(m)),o.appendChild(e)}}),i?.classList.add("hidden"),d?.classList.remove("hidden"),b()}catch(p){console.error("Failed to load apps:",p),i?.classList.add("hidden"),d&&(d.classList.remove("hidden"),a&&(a.innerHTML='<p class="text-red-600 p-4">アプリの読み込みに失敗しました</p>'),t&&(t.innerHTML='<p class="text-red-600 p-4 col-span-3 text-center">アプリの読み込みに失敗しました</p>'))}}function b(){document.getElementById("prev-btn")?.addEventListener("click",h),document.getElementById("next-btn")?.addEventListener("click",g),f()}function c(a){const t=document.getElementById("featured-apps-mobile"),o=document.getElementById("dots-container");!t||!o||(s=a,t.style.transform=`translateX(${-s*100}%)`,Array.from(o.children).forEach((i,d)=>{i.className="w-2 h-2 rounded-full transition-all duration-300 "+(d===s?"bg-blue-600 w-8":"bg-gray-300")}),v(),f())}function g(){c((s+1)%l.length)}function h(){c((s-1+l.length)%l.length)}function f(){r=setInterval(g,5e3)}function v(){r&&clearInterval(r)}y();
