import"./hoisted.mGvHz-GO.js";let d=0,r,l=[];async function y(){const s=document.getElementById("featured-apps-mobile"),t=document.getElementById("featured-apps-desktop"),a=document.getElementById("dots-container"),i=document.getElementById("apps-loading"),o=document.getElementById("apps-content");try{l=(await(await fetch("https://script.google.com/macros/s/AKfycbxcaYOnyNaovd0ERTnVKKRxZP0x4eWSftKk-mMVCXZrbuQDw8e-aPN9sj4dSDPoGYeBsg/exec")).json()).apps.slice(0,3),l.forEach((n,p)=>{const x=(n.distributionInfo?.category||"sideload")==="official"?'<span class="inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-md ml-1">App Store配信</span>':'<span class="inline-block bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-md ml-1">IPA配布</span>',u=`
            <div class="flex items-start gap-3 sm:gap-4">
              <img src="${n.iconURL}" alt="${n.name}" class="w-14 h-14 sm:w-20 sm:h-20 rounded-[22%] border border-gray-100 shadow-sm flex-shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h3 class="font-bold text-base sm:text-lg text-gray-900 leading-tight line-clamp-1">${n.name}</h3>
                    <p class="text-sm text-gray-500 mb-2">${n.developerName}</p>
                  </div>
                  <a href="${n.downloadURL}" class="flex-shrink-0 bg-[#007AFF] text-white font-bold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-center hover:bg-blue-600 transition shadow-sm whitespace-nowrap" download>入手</a>
                </div>
                <div class="flex flex-wrap items-center gap-1">
                  <span class="inline-block bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-md">${n.category}</span>
                  ${x}
                </div>
              </div>
            </div>
          `;if(s){const e=document.createElement("div");e.className="app-card flex flex-col flex-shrink-0 w-full max-w-md mx-auto",e.innerHTML=u,s.appendChild(e)}if(t){const e=document.createElement("div");e.className="app-card flex flex-col",e.innerHTML=u,t.appendChild(e)}if(a){const e=document.createElement("button");e.className="w-2 h-2 rounded-full transition-all duration-300 "+(p===0?"bg-blue-600 w-8":"bg-gray-300"),e.addEventListener("click",()=>c(p)),a.appendChild(e)}}),i?.classList.add("hidden"),o?.classList.remove("hidden"),b()}catch(m){console.error("Failed to load apps:",m),i?.classList.add("hidden"),o&&(o.classList.remove("hidden"),s&&(s.innerHTML='<p class="text-red-600 p-4">アプリの読み込みに失敗しました</p>'),t&&(t.innerHTML='<p class="text-red-600 p-4 col-span-3 text-center">アプリの読み込みに失敗しました</p>'))}}function b(){document.getElementById("prev-btn")?.addEventListener("click",h),document.getElementById("next-btn")?.addEventListener("click",f),g()}function c(s){const t=document.getElementById("featured-apps-mobile"),a=document.getElementById("dots-container");!t||!a||(d=s,t.style.transform=`translateX(${-d*100}%)`,Array.from(a.children).forEach((i,o)=>{i.className="w-2 h-2 rounded-full transition-all duration-300 "+(o===d?"bg-blue-600 w-8":"bg-gray-300")}),v(),g())}function f(){c((d+1)%l.length)}function h(){c((d-1+l.length)%l.length)}function g(){r=setInterval(f,5e3)}function v(){r&&clearInterval(r)}y();
