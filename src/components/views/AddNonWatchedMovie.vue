<template>
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addNonWatched">
        <font-awesome-icon icon="circle-plus" /> Añadir película
    </button>

    <div class="modal fade" id="addNonWatched" tabindex="-1" data-bs-backdrop="static" aria-labelledby="addNonWatchedLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addNonWatchedLabel">Añadir película por ver</h5>
                    <button @click="closeModal" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form @submit.prevent="createNonWatchedMovie">
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
                            <input type="text" class="form-control" id="director" placeholder="Director" v-model="director"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label">Descripción:</label>
                            <textarea class="form-control" id="message-text" v-model="description" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="duration" class="col-form-label">Duración:</label>
                            <input type="text" class="form-control" id="duration" placeholder="Duración" v-model="duration"
                                required>
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
</template>
<script>
import { ref, onMounted } from 'vue';
import { nonWatchedMovies } from '@/store';
import router from '@/router';
import Swal from 'sweetalert2';

export default {
    name: 'AddNonWatchedMovie',
    setup() {
        const title = ref('');
        const genre = ref(0);
        const director = ref('');
        const description = ref('');
        const duration = ref('');
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
            data.duration = parseInt(data.duration, 10);
            if (isNaN(data.duration)) {
                Swal.fire({
                    icon: "error",
                    title: "La duración debe de ser un número!"
                });
                return false;
            }

            if (data.stars === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Las estrellas no pueden ser cero!"
                });
                return false;
            }

            data.yearOfRelease = parseInt(data.yearOfRelease, 10);
            if (isNaN(data.yearOfRelease)) {
                Swal.fire({
                    icon: "error",
                    title: "El año debe de ser un número!"
                });
                return false;
            }

            return true;
        }

        const createNonWatchedMovie = async () => {
            let dataCreation = {
                title: title.value,
                genre: {
                    id: genre.value
                },
                director: director.value,
                description: description.value,
                duration: duration.value,
                stars: 1,
                yearOfRelease: yearOfRelease.value,
            };
            if(validateDataMovie(dataCreation)){
                try {
                    const response = await fetch('http://127.0.0.1:8080/api/v1/movies/to-watch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(dataCreation),
                    });

                    if (response.status === 400) {
                        const failedResponse = await response.json();
                        throw new Error(failedResponse.message);
                    }

                    if (!response.ok) {
                        const failedResponse = await response.json();
                        throw new Error('FAIL: ' + failedResponse.message);
                    }
                    const responseData = await response.json();
                    nonWatchedMovies.value.push(responseData.body);
                    title.value = "";
                    genre.value = "";
                    director.value = "";
                    description.value = "";
                    duration.value = "";
                    yearOfRelease.value = "";
                    router.push('/to-watch-movies');
                    console.log('Successful creation', responseData);
                }
                catch (error) {
                    console.error('Error during creation:', error);
                    Swal.fire({
                        icon: "error",
                        title: error.message
                    });
                }
            }
        }


        return {
            title,
            genre,
            director,
            description,
            duration,
            yearOfRelease,
            genres,
            createNonWatchedMovie
        }
    }

}
</script>
<style lang="">
    
</style>