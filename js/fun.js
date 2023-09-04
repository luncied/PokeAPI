// import axios from 'axios';
import { api, resultCont } from '../js/var.js';
export { searchPokemon, getOptData }

// Optiene los datos del pokemon buscado (parametro endpoint que recibe alguna consulta de la api)
function getData(endpoint = "pokemon/?offset=0&limit=1041", pokeapi = true){
    if (pokeapi){
        const config = {
            method: 'get',
            url: api + endpoint,
            headers: {}
        };
        return axios(config)
    };
    const config = {
        method: 'get',
        url: endpoint,
        headers: {}
    };
    return axios(config)

};

// Obtiene los datos para generar las opciones en los selects
function getOptData(select, endpoint) {
    const selectCont = select ; // elemento del contenedor formulario
    const config = {
        method: 'get',
        url: api + endpoint,
        headers: {}
    };
    axios(config)
        .then(result => {
            const optArray = result.data.results;
            addOptions(optArray, selectCont);
        });
};

// Obtiene los datos del pokemon buscado en la sección de Nombre del Pokemon
// Meter async await
function searchPokemon(inputValue) {
    let pokemon;
    let pokemonData ;

    if(!inputValue){
        pokemonData = getData()
    }else{
        pokemon = inputValue
        pokemonData = getData(`pokemon/${pokemon}`)
    }

    pokemonData
        // .then(result => console.log(result.data)) // Aqui va la funcion LOADCARDS()
        .then(result => {
            console.log(result.data.results)
            console.log(result.data.results.keys());

            loadCards(result)
        }) 
        .catch(error => error)
    
}


// Funcion para cargar las tarjetas 
function loadCards(pokeArray = []){
    const selector = resultCont;

    // Elimina los elementos viejos en caso de que se haga una nueva busqueda en la pestaña search 
    clearHTML(selector);

    // Iteramos sobre los datos del json
    pokeArray.data.results.slice(0,20).forEach(pokemon => {
            // const name = pokemon.name;
            // const info = getData(`pokemon/${name}`);
            const info = getData(pokemon.url, pokeapi=false);
            info
                .then(pokemon => {
                    console.log(pokemon);
                    createSingleCard(pokemon.data)
                })
                .catch(error => error);
    });
};

// Función que crea una sola tarjeta de personaje
function createSingleCard(data = {}){
    const name = data.name;
    const id = data.id;
    const height = data.height;
    const imgDef = data.sprites.other['official-artwork'].front_default;
    const imgShiny = data.sprites.other['official-artwork'].front_shiny;
    const types = data.types;
    const weight = data.weight;

    const charContainer = document.createElement('div');
    charContainer.classList.add('col', 'mt-3');

    const charCard = document.createElement('div');
    charCard.classList.add('card'); 
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
    // types.forEach(type => console.log(type))
    for(let obj of types){
        const contTypes = document.createElement('span');
        const pokeType = document.createElement('img');
        const typeName = obj.type.name;
        contTypes.classList.add('icon', `${typeName}`, 'badge', 'rounded-pill', 'mx-3');
        contTypes.style.width = '22%';
        contTypes.style.height = '12%';
        // contTypes.textContent = capitalize(typeName);
        pokeType.classList.add('img-fluid');
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

function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

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

function clearHTML (element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    };
};