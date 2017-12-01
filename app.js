const apiKey = 'ccd8db1c3aef44baa1bc25bbb50da327';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
var defaultSource = '';
window.addEventListener('load',async e => {
  var string_url = window.location.href;
  var url = new URL(string_url);
  var id = url.searchParams.get("Sid");
  console.log(id);
  defaultSource = id;
  updateNews();
  await  updateSources();
  sourceSelector.value = id;

  sourceSelector.addEventListener('change', e => {
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

async function updateSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
    const json = await res.json();
    sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>"`).join('\n');
}

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
    const json = await res.json();
    main.innerHTML = json.articles.map(createArticle).join('\n');
   
}

function  createArticle(article) {

    return `      
      <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>       
      `;

    
}