<template>
    <div class="container">
        <MyNavbar/>
        <h1 class="my-3">Películas por ver</h1>
        <p>Lista de películas no vistas</p>
        <div class="mb-3">
            <AddNonWatchedMovie/>
        </div>
       <div class="my-5 text-center" v-if="nonWatchedMovies.length === 0">
            <div class="d-flex justify-content-center">
                <img :src="require('/public/images/claqueta.png')" alt="Movie App">
            </div>
           <div class="d-flex justify-content-center">
            <p class=" my-3 text-secondary">No hay películas disponibles.</p>
           </div>
        </div>

        <div v-else class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Género</th>
                        <th>Director</th>
                        <th>Descripción</th>
                        <th>Duración</th>
                        <th>Estreno</th>
                        <th>Acciones</th>
                    </tr>
                    
                </thead>
                <tbody>
                    <tr v-for="movie in nonWatchedMovies" :key="movie.id">
                        <td>{{ movie.title }}</td>
                        <td>{{ movie.genre.name }}</td>
                        <td>{{ movie.director }}</td>
                        <td>{{ movie.description }}</td>
                        <td>{{ movie.duration}} mins</td>
                        <td>{{ movie.yearOfRelease }}</td>
                        <td>
                            <form @submit.prevent>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <EditNonWatchedMovie :movieObject="movie" :fetchNonWatchedMovies ="fetchNonWatchedMovies"/>
                                    </div>
                                    <div class="col-4">
                                        <DeleteWatchedMovie :idDeletedMovie="movie.id" :fetchWatchedMovies="fetchNonWatchedMovies"/>       
                                    </div>
                                    <div class="col-4">
                                        <ChangeToWatched :movieObject="movie" :fetchNonWatchedMovies="fetchNonWatchedMovies"/>
                                    </div>
                            
                                </div>
                               
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script>
    import {onMounted} from'vue';
    import router from '@/router';
    import MyNavbar from './MyNavbar.vue';
    import ChangeToWatched from './ChangeToWatched.vue';
    import {nonWatchedMovies} from '@/store';
    import DeleteWatchedMovie from './DeleteWatchedMovie.vue';
import AddNonWatchedMovie from './AddNonWatchedMovie.vue';
import EditNonWatchedMovie from './EditNonWatchedMovie.vue';
    export default{
        name: "NonWatchedMovies",
        components:{
    MyNavbar,
    ChangeToWatched,
    DeleteWatchedMovie,
    AddNonWatchedMovie,
    EditNonWatchedMovie
},

        setup() {
            
            const nonWatchedMoviesLocal = nonWatchedMovies;


            const fetchNonWatchedMovies = async()=> {
                try {
                    const response = await fetch('http://127.0.0.1:8080/api/v1/movies/to-watch', 
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization':`Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if(response.status === 401) {
                        router.push('/login');
                    }
                    
                    if (!response.ok) {
                        const failedResponse = await response.json();
                        throw new Error('Failed response',failedResponse);
                    }
                    
                    const responseData = await response.json();
                    nonWatchedMoviesLocal.value = responseData.body;

                } catch (error) {
                    console.error('Error during consume:', error);
                }

            }

            onMounted(fetchNonWatchedMovies);

            return {
                nonWatchedMovies:nonWatchedMoviesLocal,
                fetchNonWatchedMovies
            }
        }


        
    }
</script>

<style>

.watched.btn {
    background-color:orange;
    color:white;
}

.watched.btn:hover {
    background-color: orange;
    color:white;
}
.watched.btn:active {

    background-color: orange;
    color:white;
}
</style>