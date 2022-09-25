const country_parent = document.getElementById('countries')
const modeChanger = document.getElementById('change_mode')
const allCountries = document.getElementById('countries_sec')
const filterCont = document.querySelector('.filter_container')
const filterBtn = document.getElementById('filter_btn')
const serchCountryForm = document.getElementById('search_country_form')
const serchCountry = serchCountryForm.querySelector('#serch_country')
const singleCountrySec = document.getElementById("single_country")
const backBtn = document.getElementById("back")
const countryDetails = document.getElementById("country_details")

if (sessionStorage.getItem("theme") !== null) {
    if (sessionStorage.getItem("theme") === "Dark") {
        document.body.classList.add('dark')
        modeChanger.children[0].classList.replace('fa-regular', 'fa-solid')
        modeChanger.children[1].innerHTML = "Light Mode"
  }
}

async function getAllCountries(url) {
    try{
        loadingCountry(true, country_parent)

        const res = await axios.get(url)

        loadingCountry(false, country_parent)

        res.data.forEach(data => {
            const flag = data.flags.svg
            const country = typeof(data.name) === "object" ? data.name.common : data.name;
            const population = data.population == null||undefined ? "None": data.population;
            const region = data.region == null||undefined ? "None": data.region;
            const capital = data.capital == null||undefined ? "None": data.capital;

            country_parent.innerHTML += `<div class="country">
            <button class="country_el" onclick=showCountry(this) data-country="${country}">
                <img
                  src="${flag}"
                  alt="Flag-${country}"
                  class="flag"
                />
                <div class="country_details">
                  <div class="country_name">${country}</div>
                  <div class="population">
                      <span>Population:</span>
                      ${population.toLocaleString()}
                  </div>
                  <div class="region">
                      <span>Region:</span>
                      ${region}
                  </div>
                  <div class="capital">
                      <span>Capital:</span>
                      ${capital}
                  </div>
                </div>
              </button>
        </div>`
        });

    }
    catch (err){
        errorFun(err.message, country_parent)
    }
    }

getAllCountries('https://restcountries.com/v2/all?fields=flags,name,population,region,capital')

// loading
function loadingCountry(status, el) {
    if (status){
        if(document.body.classList.contains('dark')){
            el.innerHTML = `<div class="loader"><lord-icon
            src="https://cdn.lordicon.com/gqzfzudq.json"
            trigger="loop"
            delay="500"
            colors="primary:#FFFFFF,secondary:#FFFFFF"
            style="width:100px;height:100px">
        </lord-icon></div>`;
        }
        else {
            el.innerHTML = `<div class="loader"><lord-icon
            src="https://cdn.lordicon.com/gqzfzudq.json"
            trigger="loop"
            delay="500"
            colors="primary:#111517,secondary:#111517"
            style="width:100px;height:100px">
        </lord-icon></div>`;
        }
    }
    else {
        el.innerHTML = " ";
    }
}

// error
function errorFun(msg, el) {
    el.innerHTML =`<div class="loader">
            <h1 class="error">
              ${msg}
              <i class="bi bi-emoji-frown"></i>
            </h1>
          </div>`
}

// modeChanger
modeChanger.addEventListener('click', () =>{
    const body = document.body
    if (body.classList.contains('dark')) {
        sessionStorage.setItem("theme", "Light")
        body.classList.remove('dark')
        modeChanger.children[0].classList.replace('fa-solid', 'fa-regular')
        modeChanger.children[1].innerHTML = "Dark Mode"
    }
    else {
        body.classList.add('dark')
        sessionStorage.setItem("theme", "Dark")
        modeChanger.children[0].classList.replace('fa-regular', 'fa-solid')
        modeChanger.children[1].innerHTML = "Light Mode"
    }
})

// Search
serchCountryForm.addEventListener('submit', async(e)=> {
    e.preventDefault()
    let status = false;
    try{
        const countries = await axios.get('https://restcountries.com/v2/all?fields=name')

        let c_value = serchCountry.value

        if(c_value != ""){
          if(c_value.toLowerCase() == "all"){
            getAllCountries('https://restcountries.com/v2/all?fields=flags,name,population,region,capital')
          }
          else{
            for (country of countries.data){
              if(c_value.toLowerCase() === country.name.toLowerCase()){
                status=true
                const url = `https://restcountries.com/v3.1/name/${country.name.toLowerCase()}?fullText=true&fields=flags,name,population,region,capital`
                getAllCountries(url)
                break
              }
            }
    
            if(status == false){
              errorFun("Country Not Found", country_parent)
            }
            else{
              serchCountry.value = ""
            }
          }
        }
    }
    catch(err){
        errorFun(err.message, country_parent)
    }
})

// filter by reagion
filterBtn.addEventListener('click', ()=> {
    if (filterCont.classList.contains('show')) {
        filterCont.classList.remove('show')
    }
    else{
        filterCont.classList.add('show')
        const regions = filterCont.querySelector('#regions')

        regions.addEventListener('click', (e)=> {
            const region = e.target.textContent
            
            const url = `https://restcountries.com/v3.1/region/${region.toLowerCase()}?fields=flags,name,population,region,capital`;

            getAllCountries(url)
            filterCont.classList.remove('show')
        })
    }
})

// onecountry Section
async function oneCountry(country) {
  try{
    loadingCountry(true, countryDetails)

    const res = await axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`)

    let flag = res.data[0].flags.svg
    let native = res.data[0].name.official == null||undefined ? "None": res.data[0].name.official;
    let population = res.data[0].population == null||undefined ? "None": res.data[0].population;
    let region = res.data[0].region == null||undefined ? "None": res.data[0].region;
    let subRegion = res.data[0].subregion == null||undefined ? "None": res.data[0].subregion;
    let capital = res.data[0].capital == null||undefined ? "None": res.data[0].capital[0];
    let tldomain = res.data[0].tld == null||undefined ? "None": res.data[0].tld.join(', ');
    let currency = res.data[0].currencies == null||undefined ? "None" :Object.values(res.data[0].currencies)[0].name;
    let languages = res.data[0].languages == null||undefined ? "None" :Object.values(res.data[0].languages).join(', ');

    let borders = await borderButtons(res.data[0].borders) 

    loadingCountry(false, countryDetails)

    countryDetails.innerHTML = `<div class="image">
    <img src="${flag}" alt="Flag-of-${country}">
  </div>
  <div class="details">
    <h1>${country}</h1>

    <div class="key_details">
      <div>
        <div>
          <span>Native Name:</span>
          <span>${native}</span>
        </div>
        <div>
          <span>Population:</span>
          <span>${population.toLocaleString()}</span>
        </div>
        <div>
          <span>Region:</span>
          <span>${region}</span>
        </div>
        <div>
          <span>Sub Region:</span>
          <span>${subRegion}</span>
        </div>
        <div>
          <span>Capital:</span>
          <span>${capital}</span>
        </div>
      </div>

      <div>
        <div>
          <span>Top Level Domain:</span>
          <span>${tldomain}</span>
        </div>
        <div>
          <span>Currencie:</span>
          <span>${currency}</span>
        </div>
        <div>
          <span>Languages:</span>
          <span>${languages}</span>
        </div>
      </div>
    </div>


    <div class="border_country">
      <div>Border Countries:</div>
      <div>
        ${borders}
      </div>
    </div>

  </div>`

  }
  catch(err){
    errorFun(err.message, countryDetails)
  }
}

async function borderButtons(borders) {
  let borderBtns = ' ';
  if (borders){
    borders = borders.join(',')

    const borderRes = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${borders}&fields=name`)

    borderRes.data.forEach( bordr => {
        let Cname = bordr.name.common
        borderBtns += `<button onclick=oneCountry('${Cname}')>${Cname}</button>`;
      }
    );
  }
  return borderBtns == ' '? "None": borderBtns;
}

function showCountry(e){
    const country = e.getAttribute("data-country")
    singleCountrySec.classList.add('show');
    allCountries.style.opacity = "0";
    allCountries.style.display = "none";
   
    oneCountry(country)
}

backBtn.addEventListener('click', ()=> {
    singleCountrySec.classList.replace('show', 'hide')
    setTimeout(() =>{
      singleCountrySec.classList.remove('hide')
    }, 750)
    allCountries.style.opacity = "1";
    allCountries.style.display = "block";
})
