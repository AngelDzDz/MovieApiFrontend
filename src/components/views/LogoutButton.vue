<template>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                {{ user }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" href="#">Mi perfil</a></li>
                <li><a class="dropdown-item" href="#" @click="test">Obtener token</a></li>
                <li><a class="dropdown-item" href="#" @click="logout">Cerrar sesión</a></li>
            </ul>
        </li>
    
</template>
<script>
import router from '@/router';

export default {
    name: 'LogoutButton',
    setup() {

        const user = localStorage.getItem('user');

        const test = () => {
            console.log(localStorage.getItem('token'));
        };

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('authenticated');

            router.push("/login");
        }

        return {
            test,
            logout,
            user
        }

    }

}
</script>
<style lang="">
    
</style>