<template>
    <div>
    <link
      rel="stylesheet"
      href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css"
    />
    <div :class="generateClass()" id="starsEdit">
      <a 
        href="#"
        class="fa-star-o fa"
        data-index="0"
        @click="handleStarClickEdit(0)"
      ></a>
      <a 
        href="#"
        class="fa-star-o fa"
        data-index="1"
        @click="handleStarClickEdit(1)"
      ></a>
      <a
        href="#"
        class="fa-star-o fa"
        data-index="2"
        @click="handleStarClickEdit(2)"
      ></a>
      <a
        href="#"
        class="fa-star-o fa"
        data-index="3"
        @click="handleStarClickEdit(3)"
      ></a>
      <a
        href="#"
        class="fa-star-o fa"
        data-index="4"
        @click="handleStarClickEdit(4)"
      ></a>
    </div>
  </div>
</template>

<script>
import {ref,onMounted} from 'vue';
import { starNumber } from '@/store';
export default {
    
    name:'FilledRankingStars',
    props: {
      starValue: {
        type: Number,
        required: true,
      },
      movieId: {
        type:Number,
        required:true
      }
    },
    setup(props) {
    const originalStarNumber = ref(props.starValue);
    const starNumberLocal = starNumber;
    const theMovieId = ref(props.movieId);
   

    const initStars = () => {
        const stars = document.querySelectorAll(`.starsEdit${theMovieId.value} a`);
        for (let i = 0; i < originalStarNumber.value; i++) {
        stars[i].classList.remove("fa-star-o");
        stars[i].classList.add("fa-star");
      }
    }

    onMounted(initStars);

    const generateClass = () => {
        return `starsEdit${theMovieId.value}`;
    };
    const handleStarClickEdit =(starIndex) =>{
      const stars = document.querySelectorAll(`.starsEdit${theMovieId.value} a`);
    
      for (let i = 0; i <= starIndex; i++) {
        stars[i].classList.remove("fa-star-o");
        stars[i].classList.add("fa-star");
      }

      for (let i = starIndex + 1; i < stars.length; i++) {
        stars[i].classList.remove("fa-star");
        stars[i].classList.add("fa-star-o");
      }

      originalStarNumber.value = starIndex +1;
      starNumberLocal.value = starIndex +1;
    } 

    return {
        handleStarClickEdit,
        theMovieId,
        generateClass
      
    }
  }   

}

</script>

<style scoped>
#starsEdit {
  display: inline-block;
}

#starsEdit a {
  font-size: 16px;
  padding: 0 1px;
  cursor: pointer;
  color: #ffd119;
  text-decoration: none;
}

</style>