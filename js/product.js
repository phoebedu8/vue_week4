import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app =createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'yiijiee118',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      status: false, // 判斷新增或編輯狀態
      pagination: {},
    }
  },
  methods: {
    // 確認是否為登入狀態
    checkLogin() {
      const url = `${this.apiUrl}/api/user/check`;

      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    // 渲染所有產品至畫面上
    // page = 1 為預設值
    getData(page = 1) {
      // 參數 page 預設值
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((response) => {
          const { products, pagination } = response.data;
          this.products = products;
          this.pagination = pagination;
        }).catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    // 建立新產品、編輯產品會打開 Modal
    openModal(status, item) {
      // 新增產品
      // 建立新產品時先清空 tempProduct 內的資料
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.status = true;
        productModal.show();
      } else if (status === 'edit') {
        // 修改產品
        this.tempProduct = { ...item };
        this.status = false;
        productModal.show();
      } else if (status === 'delete') {
        // 刪除產品
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
});

// 分頁元件
app.component('pagination', {
  template: '#pagination',
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item); // (命名,參數)
    },
  },
});

// 產品新增&編輯元件
app.component('productModal', {
  template: '#productModal',
  props: ['product', 'status'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'yiijiee118',
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false, // 按下 esc 視窗不會關閉
      backdrop: 'static' // 點擊背景空白處視窗不會關閉
    });
  },
  methods: {
    updateProduct() {
      // 新增商品
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      // 判斷是否為新增產品，如果不是改成編輯產品 put
      if (!this.status) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
        http = 'put';
      }

      axios[http](api, { data: this.product }).then((response) => {
        alert(response.data.message);
        this.hideModal();
        this.$emit('update');
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    openModal() {
      productModal.show(); // 打開動態視窗
    },
    hideModal() {
      productModal.hide(); // 隱藏動態視窗
    },
  },
})
// 產品刪除元件
app.component('delProductModal', {
  template: '#delProductModal',
  props: ['item'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'yiijiee118',
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false, // 按下 esc 視窗不會關閉
      backdrop: 'static' // 點擊背景空白處視窗不會關閉
    });
  },
  methods: {
    delProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`).then((response) => {
        this.hideModal();
        this.$emit('update');
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    openModal() {
      delProductModal.show();
    },
    hideModal() {
      delProductModal.hide();
    },
  },
});

app.mount('#app');