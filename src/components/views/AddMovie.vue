<template>
    <div>
        <div class="mb-3">
            <router-link to="/my-movies/add">
                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <font-awesome-icon icon="circle-plus" /> Añadir película
                </button>
            </router-link>
        </div>
        <div class="modal fade" id="exampleModal" tabindex="-1" data-bs-backdrop="static"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Añadir película</h5>
                        <button @click="closeModal" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="createMovie">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="title" class="col-form-label">Título:</label>
                                <input type="text" class="form-control" id="title" placeholder="Título" v-model="title"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="genres" class="col-form-label">Género:</label>
                                <select class="form-select" name="genres" id="genres" v-model="genre" required>
                                    <option disabled value="0">Seleccione el género</option>
                                    <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="director" class="col-form-label">Director:</label>
                                <input type="text" class="form-control" id="director" placeholder="Director"
                                    v-model="director" required>
                            </div>
                            <div class="mb-3">
                                <label for="message-text" class="col-form-label">Descripción:</label>
                                <textarea class="form-control" id="message-text" v-model="description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="duration" class="col-form-label">Duración:</label>
                                <input type="text" class="form-control" id="duration" placeholder="Duración"
                                    v-model="duration" required>
                            </div>
                            <div class="mb-3">
                                <label class="col-form-label">Estrellas:</label>
                                <div>
                                    <RankingStars />
                                </div>
                                
                            </div>
                            <div class="mb-3">
                                <label for="yearOfRelease" class="col-form-label">Año de estreno:</label>
                                <input type="text" class="form-control" id="yearOfRelease" placeholder="Año de estreno"
                                    v-model="yearOfRelease" required>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success">Añadir</button>
                            <button @click="closeModal" type="button" class="btn btn-danger"
                                data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { onMounted } from 'vue';
import router from '@/router';
import { ref } from 'vue';
import { watchedMovies, starNumber } from '@/store';
import RankingStars from './RankingStars.vue';
import Swal from 'sweetalert2';
export default {
    name: 'AddMovie',
    setup() {
        const title = ref('');
        const genre = ref(0);
        const director = ref('');
        const description = ref('');
        const duration = ref('');
        const stars = ref('');
        const yearOfRelease = ref('');
        const genres = ref([]);
        onMounted(async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/genres', {
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
                genres.value = responseData.body;
            }
            catch (error) {
                console.error('Error during consume:', error);
            }
        });

        const validateDataMovie = (data) => {
            data.duration = parseInt(data.duration,10);
            if( isNaN(data.duration)) {
                Swal.fire({
                    icon:"error",
                    title:"La duración debe de ser un número!"
                });
                return false;
            }

            if (data.stars === 0) {
                Swal.fire({
                    icon:"error",
                    title:"Las estrellas no pueden ser cero!"
                });
                return false;
            }

            data.yearOfRelease = parseInt(data.yearOfRelease,10);
            if( isNaN(data.yearOfRelease)) {
                Swal.fire({
                    icon:"error",
                    title:"El año debe de ser un número!"
                });
                return false;
            }

            return true;
        }
        const createMovie = async () => {
            let dataCreation = {
                title: title.value,
                genre: {
                    id: genre.value
                },
                director: director.value,
                description: description.value,
                duration: duration.value,
                stars: starNumber.value,
                yearOfRelease: yearOfRelease.value
            };
            if (validateDataMovie(dataCreation) != false) {
                try {
                    const response = await fetch('http://127.0.0.1:8080/api/v1/movies/watched', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(dataCreation),
                    });

                    if(response.status === 400) {
                        const failedResponse = await response.json();
                        throw new Error(failedResponse.message);
                    }
                   
                    if (!response.ok) {
                        const failedResponse = await response.json();
                        throw new Error('FAIL: ' + failedResponse.message);
                    }
                    const responseData = await response.json();
                    watchedMovies.value.push(responseData.body);
                    title.value = "";
                    genre.value = "";
                    director.value = "";
                    description.value = "";
                    duration.value = "";
                    stars.value = "";
                    yearOfRelease.value = "";
                    router.push('/my-movies');
                    console.log('Successful creation', responseData);
                }
                catch (error) {
                    console.error('Error during creation:', error);
                    Swal.fire({
                        icon:"error",
                        title:error.message
                    });
                }
            }

        };

        const closeModal = () => {
            router.push('/my-movies');
        }
        return {
            title,
            genre,
            director,
            description,
            duration,
            stars,
            yearOfRelease,
            createMovie,
            genres,
            closeModal
        };
    },
    components: { RankingStars }
};
</script>