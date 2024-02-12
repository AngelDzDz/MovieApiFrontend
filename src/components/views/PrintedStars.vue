<template>
  <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css"/>
  <div>
      <div class="printedStars" v-for="number in receivedNum" :key="number">
      <a class="fa-star fa"></a>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'PrintedStars',
    props: {
      receivedNumber: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      return {
        receivedNum: props.receivedNumber,
      };
    },
  };
  </script>


<style scoped>
.printedStars {
  display: inline-block;
}

.printedStars a {
  font-size: 16px;
  padding: 0 1px;
  cursor: default;
  color: #ffd119;
  text-decoration: none;
}

</style>