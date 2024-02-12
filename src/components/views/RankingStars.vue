<template>

    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css" />
    <div class="stars" id="star1">
      <a href="#" class="fa-star-o fa" data-index="0" @click="handleStarClick(0)"></a>
      <a href="#" class="fa-star-o fa" data-index="1" @click="handleStarClick(1)"></a>
      <a href="#" class="fa-star-o fa" data-index="2" @click="handleStarClick(2)"></a>
      <a href="#" class="fa-star-o fa" data-index="3" @click="handleStarClick(3)"></a>
      <a href="#" class="fa-star-o fa" data-index="4" @click="handleStarClick(4)"></a>
    </div>
  
</template>

<script>
import { starNumber } from '@/store';
export default {
  name: "RankingStars",

  setup() {
    const starNumberLocal = starNumber;
    const handleStarClick = (starIndex) => {
      const stars = document.querySelectorAll(".stars a");

      for (let i = 0; i <= starIndex; i++) {
        stars[i].classList.remove("fa-star-o");
        stars[i].classList.add("fa-star");
      }

      for (let i = starIndex + 1; i < stars.length; i++) {
        stars[i].classList.remove("fa-star");
        stars[i].classList.add("fa-star-o");
      }
      starNumberLocal.value = starIndex + 1;
    }

    return {
      handleStarClick,
      starNumber: starNumberLocal
    }
  }

};
</script>

<style scoped>
.stars {
  display: inline-block;
}

.stars a {
  font-size: 16px;
  padding: 0 1px;
  cursor: pointer;
  color: #ffd119;
  text-decoration: none;
}
</style>
