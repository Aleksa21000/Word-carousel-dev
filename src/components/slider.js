import { transform } from "../global/transform";
import { lerp } from "../global/math";

const slider = () => {
    const carousels = document.querySelectorAll(".js-carousel");
    const carouselObjects = [];
  
    class Carousel {
      constructor(carousel, direction) {
        this.carousel = carousel;
        this.containerInner = carousel.querySelector(".js-carousel-inner");
        this.containerOuter = carousel.querySelector(".js-carousel-outer");
        this.direction = direction;
        this.width = this.containerInner.getBoundingClientRect().width;
        this.currentWidth = window.innerWidth;
        this.counter = this.width / 4;
        this.lastScrollTop = 0;
        this.currentDirection;
        this.outerMovementPercentage = 0;
        this.lerpOuterMovementPercentage = 0;
        this.init();
      }
  
      init() {
        window.addEventListener("resize", () => {
          this.resizedWidth = window.innerWidth;
  
          if (this.currentWidth !== this.resizedWidth) {
            this.width = this.containerInner.getBoundingClientRect().width;
            this.counter = this.width / 3;
          }
        });
  
        window.addEventListener("scroll", () => {
          const scrollTop = window.pageYOffset || document.body.scrollTop;
          if (scrollTop > this.lastScrollTop) {
            this.currentDirection = "down";
          } else {
            this.currentDirection = "up";
          }
          this.lastScrollTop = scrollTop;
        });
      }
  
      updateInner() {
        if (this.counter >= this.width / 3) {
          this.counter = 0;
        } else if (this.counter <= 0) {
          this.counter = this.width / 3;
        }
  
        transform(this.containerInner, `translate3d(${-this.counter}px, 0px, 0px)`);
  
        if (this.currentDirection === "down") {
          if (this.direction === "right") this.counter += 1;
          if (this.direction === "left") this.counter -= 1;
        } else {
          if (this.direction === "right") this.counter -= 1;
          if (this.direction === "left") this.counter += 1;
        }
      }
  
      updateOuter() {
        this.position = this.carousel.getBoundingClientRect().top - innerHeight;
        this.carouselHeight = this.carousel.getBoundingClientRect().height;
        this.maxHeight = this.carouselHeight + innerHeight;
  
        this.outerMovementPercentage = this.position / this.maxHeight;
        this.lerpOuterMovementPercentage = lerp(this.lerpOuterMovementPercentage, this.outerMovementPercentage, 0.1);
  
        if (this.direction === "right") transform(this.containerOuter, `translate3d(${+this.lerpOuterMovementPercentage * 1400}px, 0px, 0px)`);
        if (this.direction === "left") transform(this.containerOuter, `translate3d(${-this.lerpOuterMovementPercentage * 1400}px, 0px, 0px)`);
      }

      updateOuterMobile() {
        this.position = this.carousel.getBoundingClientRect().top - innerHeight;
        this.carouselHeight = this.carousel.getBoundingClientRect().height;
        this.maxHeight = this.carouselHeight + innerHeight;
  
        this.outerMovementPercentage = this.position / this.maxHeight;
        this.lerpOuterMovementPercentage = lerp(this.lerpOuterMovementPercentage, this.outerMovementPercentage, 0.1);
  
        if (this.direction === "right") transform(this.containerOuter, `translate3d(${+this.lerpOuterMovementPercentage * 200}px, 0px, 0px)`);
        if (this.direction === "left") transform(this.containerOuter, `translate3d(${-this.lerpOuterMovementPercentage * 200}px, 0px, 0px)`);
      }
    }
  
    const generateCarousels = () => {
      carousels.forEach((carousel) => {
        const direction = carousel.getAttribute("data-direction");
        carouselObjects.push(new Carousel(carousel, direction));
      });
    };
  
    if (document.fonts.status === "loaded") {
      generateCarousels();
    } else {
      document.fonts.onloadingdone = () => {
        generateCarousels();
      };
    }
  
    const animate = () => {
      carouselObjects.forEach((carouselObject) => {
        carouselObject.updateInner();
        if(window.innerWidth >= 768) {
          carouselObject.updateOuter();
        } else {
          carouselObject.updateOuterMobile();
        }
      });
      requestAnimationFrame(animate);
    };
  
    animate();
}

export default slider;