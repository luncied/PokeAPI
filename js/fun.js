// import axios from 'axios';
import { api, resultCont } from '../js/var.js';
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

// Obtiene los datos para generar las opciones en los selects
async function getOptData(select, endpoint) {
    const selectCont = select ; // elemento del contenedor formulario

    const response = await fetch(api + endpoint);
    const result = await response.json();
    const optArray = result.results;
    addOptions(optArray, selectCont);
};

// Función que crea una sola tarjeta de personaje
function createSingleCard(data = {}){
    const {name, id, height, types, weight} = data;
    const imgDef = data.sprites.other['official-artwork'].front_default;
    const imgShiny = data.sprites.other['official-artwork'].front_shiny;

    const charContainer = document.createElement('div');
    charContainer.classList.add('col', 'mt-3', 'd-flex', 'justify-content-around');

    const charCard = document.createElement('div');
    charCard.classList.add('card', 'pokemon-card'); 
    charCard.setAttribute('id', `${name}`); 
    charCard.setAttribute('name', `${name}`); 
    charCard.style = "width: 15rem;"

    const charImg = document.createElement('img');
    charImg.classList.add('card-img-top');
    charImg.alt = `${name}_img`;
    charImg.src = imgDef;

    const charCardBody = document.createElement('div'); 
    charCardBody.classList.add('card-body');

    const charID = document.createElement('p');
    charID.classList.add('card-subtitle','text-secondary-emphasis', 'ts-1', 'pt-3');
    charID.textContent = `ID N.° ${id}`;

    const charHeading = document.createElement('h4');
    charHeading.classList.add('card-title', 'p-2');
    charHeading.textContent = capitalize(name);
    
    const charTypes = document.createElement('div');
    charTypes.classList.add('d-inline', 'input-group', 'justify-content-start', 'py-5');

    for(let obj of types){
        const contTypes = document.createElement('span');
        const pokeType = document.createElement('img');
        const typeName = obj.type.name;
        contTypes.classList.add('icon', `${typeName}`, 'badge', 'rounded-pill', 'mx-3');
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
    }
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
    for(let pokemon of pokeArray){
        const info = await getData(pokemon.url);
        createSingleCard(info);
    }
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

// Obtiene los datos del pokemon buscado en la sección de Nombre del Pokemon
async function searchPokemon(inputValue) {
    const selector = resultCont;
    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);

    let pokemon;
    let pokemonData ;

    if(!inputValue){
        pokemonData = await getData();
    } else{
        pokemon = inputValue;
        pokemonData = getData(api + `pokemon/${pokemon}`);
    }

    try{
        loadCards(pokemonData);

    } catch{
        console.error('Error al cargar la base de datos. Consulte al desarrollador para mas información');
    }

    return pokemonData;
}

// Añade las opciones a los selectores de Tipo y de Generación
function addOptions(optArray = [], selector) {
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
