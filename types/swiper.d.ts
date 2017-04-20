declare module "swiper" {
    namespace swiper {
        type SwiperEffect = 'slide' | 'fade' | 'flip' | 'cube' | 'coverflow';
        type PaginationType =  'bullets' | 'fraction' | 'progress';
    }
    interface SwiperOptions {

    }
    export = swiper;
}