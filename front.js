const apiKey = 'ccd8db1c3aef44baa1bc25bbb50da327';
const main = document.querySelector('main');

window.addEventListener('load',async e => {
  await  updateSourcesindex();
      main.addEventListener('change', e => {
     updateNews(e.target.value);
  });
  if('serviceWorker' in navigator){
      try{
          navigator.serviceWorker.register('sw.js');
          console.log(`Service Worker Registered`);
      }catch (error){
          console.log(`Service Worker Registration Failed`);
      }
  }
});

async function updateSourcesindex() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const json = await res.json();
    main.innerHTML = json.sources.map(src => `<div  class="article"><a href="news.html?Sid=${src.id}"><h2>${src.name}</h2><p>${src.id}</p></a></div>`).join('\n');
}

    
