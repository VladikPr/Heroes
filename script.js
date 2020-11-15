window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    class DisplayHeroes{
        constructor(selector, select){
            this.container = document.querySelector(selector);
            this.selection = document.querySelector(select);
        }

        filterMovie(heroes) {
            const uniqueMovies = new Set();
            let arr = [];
            heroes.forEach(item => {
                if(item.movies){
                    item.movies.forEach(movie => {
                        uniqueMovies.add(movie);
                    });
                }
            });

            uniqueMovies.forEach(item => arr.push(item));
            arr = arr.sort();

            arr.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                this.selection.append(option);
            });
        }   

        createCards(data, selection = 'all'){

            const checkData = (element) =>{
                let films;
                let status;
                if(element.movies){
                    films = element.movies.join(', ');
                }else{
                    films = "отсутствует";
                }

                if (element.deathDay < 2020){
                    status = 'погиб';
                }else{
                    status = 'активен';
                }
                return [films,status];
            };


            const createItem = (item) =>{
                const components = checkData(item);
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <div class="card-img"></div>
                    <div class="card-content">
                        <div class="card-content__name"><span class="bold-text">имя:</span> ${item.name}</div>
                        <div class="card-content__realname"><span class="bold-text">настоящее имя:</span> ${item.realName}</div>
                        <div class="card-content__films"><span class="bold-text">список фильмов:</span> ${components[0]}</div>
                        <div class="card-content__status"><span class="bold-text">статус:</span> ${components[1]}</div>
                    </div>
                `;

                card.querySelector('.card-img').style.background = `url(${item.photo}) center top -2px/cover no-repeat`;
                this.container.append(card);
            };

            const selectedMovie = (item) =>{
                let arr;
                if(item.movies){
                    let check = item.movies.some(el => el === selection);
                    if(check){
                        createItem(item);
                    }
                }
                
            };

            data.forEach(item => {
                if(selection === 'all'){
                    createItem(item);
                }else{
                    selectedMovie(item);
                }
            });

        }

        getRequest(){
            const request = new XMLHttpRequest();
            request.open('GET', './dbHeroes.json');
            request.setRequestHeader('Content-Type', 'application/json');
            request.send();
            
            request.addEventListener('readystatechange', () => {
                if(request.readyState === 4 && request.status === 200){
                    const data = JSON.parse(request.responseText);
                    this.createCards(data);
                    this.filterMovie(data);
                    this.events(data);
                }

            });
            
        }

        events(data){
            this.selection.addEventListener('change', (e)=>{
                e.preventDefault();
                const {target} = e;
                this.container.innerHTML = "";
                this.createCards(data, target.value);
            });
        }

        init() {
            this.getRequest();
        }
    }

    const displayHeroes = new DisplayHeroes('.card-wrapper', '#film');

    displayHeroes.init();
});



