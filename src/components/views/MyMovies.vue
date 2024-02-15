<template>
    <div class="container">

        <MyNavbar />
        <h1 class="my-3">Mis películas</h1>
        <p>Lista de películas vistas</p>
        <div class="mb-3">
            <AddMovie />
        </div>
        <div class="my-5 text-center" v-if="watchedMovies.length === 0">
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
                        <th>Estrellas</th>
                        <th>Estreno</th>
                        <th>Acciones</th>
                    </tr>

                </thead>
                <tbody>
                    <tr v-for="movie in watchedMovies" :key="movie.id">
                        <td>{{ movie.title }}</td>
                        <td>{{ movie.genre.name }}</td>
                        <td>{{ movie.director }}</td>
                        <td>{{ movie.description }}</td>
                        <td>{{ movie.duration }} mins</td>
                        <td>
                            <div class="row">
                                <div class="col-12">
                                    <PrintedStars :receivedNumber="movie.stars" />
                                </div>
                                
                            </div>
                            
                        </td>
                        <td>{{ movie.yearOfRelease }}</td>
                        <td>
                            <form @submit.prevent>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <EditWatchedMovie :movieObject="movie" :fetchWatchedMovies="fetchWatchedMovies"/>
                                    </div>
                                    <div class="col-6">
                                        <DeleteWatchedMovie :idDeletedMovie="movie.id" :fetchWatchedMovies="fetchWatchedMovies"/>
                                    </div>
                                </div>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div>

    </div>
</template>


<script>
import { onMounted } from 'vue';
import MyNavbar from './MyNavbar.vue';
import router from '@/router';
import AddMovie from './AddMovie.vue';
import { watchedMovies } from '@/store';
import PrintedStars from './PrintedStars.vue';
import EditWatchedMovie from './EditWatchedMovie.vue'
import DeleteWatchedMovie from './DeleteWatchedMovie.vue';

export default {
    name: "MyMovies",
    components: {
        MyNavbar,
        AddMovie,
        PrintedStars,
        EditWatchedMovie,
        DeleteWatchedMovie
    },
    setup() {
        const watchedMoviesLocal = watchedMovies;

        const fetchWatchedMovies = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/movies/watched', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.status === 401) {
                    router.push('/login');
                }
                if (!response.ok) {
                    const failedResponse = await response.json();
                    throw new Error('Failed response', failedResponse);
                }
                const responseData = await response.json();
                watchedMoviesLocal.value = responseData.body;
            }
            catch (error) {
                console.error('Error during consume:', error);
            }
        };

        onMounted(fetchWatchedMovies);

        const openModal = () => {
            router.push("my-movies/add");
        }

        return {
            watchedMovies: watchedMoviesLocal,
            openModal,
            fetchWatchedMovies
        };
    }
}
</script>