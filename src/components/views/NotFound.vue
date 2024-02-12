<template>

    <div class="d-flex align-items-center justify-content-center vh-100 text-center">
        <div>
            <img :src="require('/public/images/notFound.png')" alt="Not found" width="100" height="100">
            <h1 class="mb-3">Página no encontrada</h1>
            <p>Lo sentimos, la página que buscas no se ha encontrado</p>
            <div class="my-6">
                <button class="btn btn-primary" @click="goToLogin()">Ir a la página principal</button>
            </div>
        </div>
    </div>
    
</template>

<script>
import router from '@/router'

    export default {
        name:'NotFound',

        setup() {
            const goToLogin = () => {
                router.push('/login');
            };

            return {
                goToLogin
            
            }
        }
    }

</script>