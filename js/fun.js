// import axios from 'axios';
import { api, resultCont, modal } from '../js/var.js';
import capitalize from '../helpers/capitalize.js';
import clearHTML from '../helpers/clearHTML.js'

export { searchPokemon, getOptData, loadPokemons, loadCards }

// Optiene los datos del pokemon buscado (parametro endpoint que recibe alguna consulta de la api)
async function getData(endpoint){
    try{
        if (!endpoint){
            const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1010");
            const result = await response.json()
            return result
        };
        const response = await fetch(endpoint);
        const result = await response.json()
        return result
    } catch {
        console.error("Error al obtener los datos de la api")
    }

};

// Función que crea una sola tarjeta de personaje
function createSingleCard(data = {}){
    const {name, id, types} = data;
    const imgDef = data.sprites.other['official-artwork'].front_default;

    const charContainer = document.createElement('div');
    charContainer.classList.add('col', 'mt-3', 'd-flex', 'justify-content-center');

    const charCard = document.createElement('div');
    charCard.classList.add('card', 'pokemon-card'); 
    charCard.setAttribute('id', `${name}`); 
    charCard.setAttribute('name', `${name}`); 
    charCard.style = "width: 15rem"; 

    const charImg = document.createElement('img');
    charImg.classList.add('card-img-top', 'pointer');
    charImg.alt = `${name}_img`;
    charImg.src = imgDef;
    charImg.dataset.bsTarget = "#modal";
    charImg.dataset.bsToggle = "modal";
    charImg.addEventListener('click', () => {
        modalShowInformation(data);
    })

    const charCardBody = document.createElement('div'); 
    charCardBody.classList.add('card-body');

    const charID = document.createElement('p');
    charID.classList.add('card-subtitle','text-secondary-emphasis', 'ts-1', 'pt-3');
    charID.textContent = `ID N.° ${id}`;

    const charHeading = document.createElement('h3');
    charHeading.classList.add('card-title', 'p-2', 'pointer');
    charHeading.textContent = capitalize(name);
    charHeading.dataset.bsTarget = "#modal";
    charHeading.dataset.bsToggle = "modal";
    charHeading.addEventListener('click', () => {
        modalShowInformation(data);
    })

    
    const charTypes = document.createElement('div');
    charTypes.classList.add('d-inline', 'input-group', 'justify-content-start', 'py-3');

    types.forEach(obj => {
        const contTypes = document.createElement('span');
        const pokeType = document.createElement('img');
        const typeName = obj.type.name;
        contTypes.classList.add('icon', `${typeName}`, 'badge', 'type-badge', 'rounded-pill', 'mx-3');
        contTypes.title = `${capitalize(typeName)}`;
        contTypes.style.width = '25%';
        contTypes.style.height = '30%';
        // contTypes.textContent = capitalize(typeName);
        pokeType.classList.add('img-fluid');
        pokeType.title = `${capitalize(typeName)}`;
        pokeType.src = `./assets/img/types/${typeName}.svg`;
        pokeType.alt = `${typeName}_img`;
        contTypes.appendChild(pokeType);
        charTypes.appendChild(contTypes);
    });

    // ordenar html
    charCardBody.appendChild(charID);
    charCardBody.appendChild(charHeading);
    charCardBody.appendChild(charTypes);

    charCard.appendChild(charImg);
    charCard.appendChild(charCardBody);

    charContainer.appendChild(charCard);

    resultCont.appendChild(charContainer);
};

// Funcion para cargar las tarjetas 
async function loadCards(pokeArray = []){
    // Iteramos sobre los datos del json
    var pokeArr = await Promise.all(pokeArray.map(async pokemon => {
        return await getData(pokemon.url);
    }));
    
    pokeArr = sortArrByObjProp(pokeArr, "id");

    pokeArr.forEach(pokemon => createSingleCard(pokemon));
};

// Consulta el endpoint de la api y carga las tarjetas de los pokemones. Regresa la consulta a la api
async function loadPokemons(endpoint){
    let pokemons;
    try{
        if(endpoint){
            pokemons = await getData(endpoint);
        } else{
            pokemons = await getData();
            loadCards(pokemons.results.slice(0, 30));
        };
    } catch {
        console.error("No es posible cargar la pagina, contacte a soporte")
    };

    return pokemons;
}

// Obtiene los datos para generar las opciones en los selects
async function getOptData(select, endpoint){
    const selectCont = select ; // elemento del contenedor formulario

    const response = await fetch(api + endpoint);
    const result = await response.json();
    const optArray = result.results;
    addOptions(optArray, selectCont);
};

// Añade las opciones a los selectores de Tipo y de Generación
function addOptions(optArray = [], selector){
    /*
        selector : Contenedor del formulario
    */
    for(let element of optArray){
        const option = document.createElement('option');
        option.value = element.name;
        option.textContent = capitalize(element.name); // Capitaliza el elemento
        selector.appendChild(option);
    };
};

async function modalShowInformation(data){
    clearHTML(modal);
    const {name, id, height, types, weight} = data;
    const imgDef = data.sprites.other['official-artwork'].front_default;
    const imgShiny = data.sprites.other['official-artwork'].front_shiny;
    // const speciesURL = data.species.url;
    // const evol = await getData(speciesURL);
    // const evolChain = await getData(evol.evolution_chain.url);
    // console.log(evolChain.chain.evolves_to)
    
    const modalBody = `
        <div class="modal-content d-flex" id="modal-pokemon-info">
            <div class="modal-header justify-content-center">
                <h3 class="">${capitalize(name)}</h3>
                <button class="btn-close pointer" type="button" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-7">
                            <h5>ID: N° ${id}</h5>
                            <div id="carrousel-def-shiny" class="carousel slide carousel-fade carousel-dark" data-bs-ride="carousel">
                                <div class="carousel-indicators">
                                    <button type="button" data-bs-target="#carrousel-def-shiny" data-bs-slide-to="0"
                                        class="active" aria-current="true" aria-label="Default form">Default</button>
                                    <button type="button" data-bs-target="#carrousel-def-shiny" data-bs-slide-to="1"
                                        aria-label="Shiny form">Shiny</button>
                                </div>
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <img src="${imgDef}" alt="${name}-img" class="img-fluid col-10">
                                    </div>
                                    <div class="carousel-item">
                                        <img src="${imgShiny}" alt="${name}-shiny-img" class="img-fluid col-10">
                                    </div>
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carrousel-def-shiny"
                                    data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Anterior</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carrousel-def-shiny"
                                    data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Siguiente</span>
                                </button>
                            </div>

                        </div>
                        <div class="col-md-5">
                            <p>Tipo: ${
                                types.length == 2 ? types.reduce((a,b) => capitalize(a.type.name) + ", " +
                                capitalize(b.type.name)) : capitalize(types[0].type.name)
                                }</p>
                            <p>Altura promedio: ${height}</p>
                            <p>Peso promedio: ${weight}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-start">
                <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    
    `
    modal.innerHTML = modalBody;

    // const header = modal.children[0];
    // const body = modal.children[1];
    
    // clearHTML(header);
    // clearHTML(body);

    // const title = document.createElement('h3');
    // title.textContent = capitalize(name);

    // const closeBtn = document.createElement('buton');
    // closeBtn.type = "button";
    // closeBtn.classList.add('btn-close');
    // closeBtn.setAttribute('data-bs-dismiss', 'modal');
    // closeBtn.style= "cursor: pointer";

    // header.appendChild(title);
    // header.appendChild(closeBtn);

    // const imgCont = document.createElement('img');
    // imgCont.classList.add('img-fluid');
    // imgCont.src = imgDef;
    // imgCont.alt = `${name}-img`;

    // body.appendChild(imgCont);
}

// Obtiene los datos del pokemon buscado en la sección de Nombre del Pokemon
function searchPokemon(data, input){
    try{
        var conincidences = data.results.map(pokemon => {
            if (pokemon.name.includes(input.toLowerCase())) {
                return pokemon;
            }
            return;
        }).filter(Boolean);
        return conincidences
    } catch {
        console.error("Busqueda no encontrada");
    };
};

function sortArrByObjProp(array, prop){
    array.sort((a, b) => {
        if (a[prop] > b[prop]){
            return 1;
        }
        if (a[prop] < b[prop]){
            return -1;
        }
        return 0
    });
    return array
};

// // Actualiza la selección de las cards de cada pokemon
// async function updateCardSelector(){
//     let cards = await waitForElm('#pokedex-result-container').childNodes;
//     return cards;
// };

// async function nextPage(consult){
//     const currentPage = consult;
//     const nextPage = currentPage.next;
//     return nextPage;
// };


// function createSingleCard(data = {}){
//     // console.log(data)
//     const {name, id, height, types, weight} = data;
//     const imgDef = data.sprites.other['official-artwork'].front_default;
//     const imgShiny = data.sprites.other['official-artwork'].front_shiny;
//     let card = `
//         <div class="col mt-3">
//             <div class="card" style="width: 15rem">
//                 <!-- <img src=${imgDef} alt=${name}_img class="card-img-top"> -->
//                 <div class="card-body">
//                     <p class="card-subtitle text-secondary-emphasis ts-1 pt-3">
//                         ID N.° ${id}
//                     </p>
//                     <h4 class="card-title p-2">
//                         ${capitalize(name)}
//                     </h4>
//                     <div class="char-types d-inline input-group justify-content-start py-5" id="type${id}"></div>
//                 </div>
//             </div>
//         </div>
//     `;

//     resultCont.innerHTML+=card;
//     const charType = document.querySelector(`#type${id}`);
//     types.forEach(obj => {
//         const typeName = obj.type.name;
//         const contTypes = `
//             <span class="icon ${typeName} badge rouded-pill mx-3" style="width: 22%; height: 12%">
//                 <img src="./assets/img/types/${typeName}.svg"/ alt="${typeName}_img" class="img-fluid">
//             </span>
//         `;
//         charType.innerHTML += contTypes;
//     })
// }





// To sort an object by a value or key
// const maxSpeed = {
//     car: 300, 
//     bike: 60, 
//     motorbike: 200, 
//     airplane: 1000,
//     helicopter: 400, 
//     rocket: 8 * 60 * 60
// };

// const sortable = Object.fromEntries(
//     Object.entries(maxSpeed).sort(([,a],[,b]) => a-b)
// );

// console.log(sortable);
