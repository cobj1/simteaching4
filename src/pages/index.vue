<template>
  <el-scrollbar wrapClass="scrollbar-wrap" width="8px" height="100%" style="background-color: #ecc9aa;"
    ref="scrollbarContainer">
    <home-top></home-top>
    <div class="image__load">
      <el-carousel height="450px">
        <el-carousel-item v-for="item in 2" :key="item">
          <el-image v-show="item == 1" src="/image/11.webp" />
          <img v-show="item == 1" src="/image/1.webp" class="overlay" />
          <span class="overlay-text">——&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;起
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;和&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;新
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;——</span>
          <el-image v-show="item == 2" src="/image/22.webp" />
          <img v-show="item == 2" src="/image/2.webp" class="overlay-one" />
          <img v-show="item == 2" src="/image/3.webp" class="overlay-two" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-row class="row-background" style="height: 435px;">
      <el-col
        style="margin-top: 1%; margin-left: 1%; border-radius: 2px; border: 1px solid #e2d9b4; background-color: #fffbeb; width: 71%; max-width: 71%; height: 100%;">
        <el-affix style="margin-top: 2%;">
          <el-button color="#7a5b38" @mouseenter="handleMouseEnter" plain>校园咨询</el-button>
          <el-button color="#7a5b38" @mouseenter="handleMouseEnter2" plain>招生信息</el-button>
          <el-button color="#7a5b38" @mouseenter="handleMouseEnter3" plain>教学资源</el-button>
          <el-table v-if="showContent" :data="tableData" :row-style="{ height: '53px' }" :show-header="false"
            @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
            <el-table-column prop="name" width="780" style="font-size: 16px;" />
            <el-table-column prop="date" style="font-size: 12px;" />
          </el-table>
          <el-table v-if="showContent2" :data="tableData1" :row-style="{ height: '53px' }" :show-header="false"
            @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
            <el-table-column prop="name" width="780" style="font-size: 16px;" />
            <el-table-column prop="date" style="font-size: 12px;" />
          </el-table>
          <el-table v-if="showContent3" :data="tableData2" :row-style="{ height: '53px' }" :show-header="false"
            @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
            <el-table-column prop="name" width="780" style="font-size: 16px;" />
            <el-table-column prop="date" style="font-size: 12px;" />
          </el-table>
        </el-affix>
      </el-col>
      <el-col style="margin-top: 1%; margin-left: 1%; width: 26%; max-width: 26%; height: 100%;">
        <el-carousel height="420px">
          <el-carousel-item v-for="item in 3" :key="item">
            <el-image style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-show="item == 1"
              src="/image/01.webp" />
            <el-image style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-show="item == 2"
              src="/image/02.webp" />
            <el-image style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" v-show="item == 3"
              src="/image/03.webp" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-row class="row-background" style="height: 150px;">
      <el-col style="margin-top: 1%;width: 98%;max-width: 98%; min-width: 98%; height: 100%; max-height: 120px;
			 background-image: url('/image/bg.webp'); background-repeat: no-repeat; background-size: cover; margin-left: 1%;">
        <img style="margin-top: 3%; margin-left: 18%;" src="/image/wenzi.webp" />
      </el-col>
    </el-row>
    <el-row class="row-background" style="height: 420px;">
      <el-col class="row-background-col">
        <div class="row-background-div">
          <el-divider direction="vertical" />
          <span style="display: flex; margin-top: 2.5%; margin-left: 1%; font-size: 18px; color: #784f3c;">德育工作</span>
          <el-button link style="display: flex; margin-top: 2.5%; margin-left: 63%;">MORE</el-button>
        </div>
        <el-table :data="tableData" :row-style="{ height: '53px' }" :show-header="false"
          @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
          <el-table-column prop="name" width="320" style="font-size: 16px;" />
          <el-table-column prop="date" style="font-size: 12px;" />
        </el-table>
      </el-col>
      <el-col class="row-background-col">
        <div class="row-background-div">
          <el-divider direction="vertical" />
          <span style="display: flex; margin-top: 2.5%; margin-left: 1%; font-size: 18px; color: #784f3c;">教学科研</span>
          <el-button link style="display: flex; margin-top: 2.5%; margin-left: 63%;">MORE</el-button>
        </div>
        <el-table :data="tableData2" :row-style="{ height: '53px' }" :show-header="false"
          @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
          <el-table-column prop="name" width="320" style="font-size: 16px;" />
          <el-table-column prop="date" style="font-size: 12px;" />
        </el-table>
      </el-col>
      <el-col class="row-col-thin">
        <div class="row-col-thin-div">
          <el-divider direction="vertical" />
          <span style="display: flex; margin-top: 3.5%; margin-left: 0%; font-size: 18px; color: #784f3c;">专题链接</span>
        </div>
        <div class="button-group">
          <el-button @click="Jump('/main/famous')">
            <el-icon :size="20">
              <User />
            </el-icon>
            &nbsp;&nbsp;&nbsp;名师工作室
          </el-button>
          <el-button @click="Jump('/main/famous')">
            <el-icon :size="20">
              <Service />
            </el-icon>
            &nbsp;&nbsp;&nbsp;心理工作室
          </el-button>
          <el-button @click="Jump('/moral/gym')">
            <el-icon :size="20">
              <Baseball />
            </el-icon>
            &nbsp;&nbsp;阳光体育活动</el-button>
          <el-button @click="Jump('/news/notice')">
            <el-icon :size="20">
              <Flag />
            </el-icon>
            &nbsp;&nbsp;&nbsp;国旗下的讲话</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="row-background" style="height: 120px;">
      <el-button class="btn-style" style="background-image: url('/image/btn1.webp');margin-left: 1%;">
        <span style="color: white; font-size: 28px;">群众路线教育</span>
      </el-button>
      <el-button @click="Jump('/main/famous')" class="btn-style"
        style="background-image: url('/image/btn2.webp'); margin-left: 0.7%;">
        <span style="color: white; font-size: 28px;">阳光体育活动</span>
      </el-button>
      <el-button class="btn-style" style="background-image: url('/image/btn3.webp'); margin-left: 0.7%;">
        <span style="color: white; font-size: 28px;">中国禁毒展览馆</span>
      </el-button>
      <el-button class="btn-style" style="background-image: url('/image/btn4.webp'); margin-left: 0.7%;">
        <span style="color: white; font-size: 28px;">校长信箱</span>
      </el-button>
    </el-row>
    <el-row class="row-background" style="height: 420px;">
      <el-col class="row-background-col">
        <div class="row-background-div">
          <el-divider direction="vertical" />
          <span style="display: flex; margin-top: 2.5%; margin-left: 1%; font-size: 18px; color: #784f3c;">党群工作</span>
          <el-button link style="display: flex; margin-top: 2.5%; margin-left: 63%;">MORE</el-button>
        </div>
        <el-table :data="tableData3" :row-style="{ height: '53px' }" :show-header="false"
          @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
          <el-table-column prop="name" width="320" style="font-size: 16px;" />
          <el-table-column prop="date" style="font-size: 12px;" />
        </el-table>
      </el-col>
      <el-col class="row-background-col">
        <div class="row-background-div">
          <el-divider direction="vertical" />
          <span style="display: flex; margin-top: 2.5%; margin-left: 1%; font-size: 18px; color: #784f3c;">平安校园</span>
          <el-button link style="display: flex; margin-top: 2.5%; margin-left: 63%;">MORE</el-button>
        </div>
        <el-table :data="tableData4" :row-style="{ height: '53px' }" :show-header="false"
          @row-click="Jump('/news/campusinfo-one')" style="margin-bottom: 15px; width: 100%;">
          <el-table-column prop="name" width="320" style="font-size: 16px;" />
          <el-table-column prop="date" style="font-size: 12px;" />
        </el-table>
      </el-col>
      <el-col class="row-col-thin">
        <div class="row-col-thin-div">
          <el-divider direction="vertical" />
          <span style="display: flex; margin-top: 3.5%; margin-left: 0%; font-size: 18px; color: #784f3c;">快速通道</span>
        </div>
        <div class="button-group">
          <el-button @click="Jump('/login')" style="margin-top: 60px;">
            <el-icon :size="20">
              <School />
            </el-icon>
            &nbsp;&nbsp;&nbsp;新生报名
          </el-button>
          <el-button @click="Jump('/login')">
            <el-icon :size="20">
              <Document />
            </el-icon>
            &nbsp;&nbsp;&nbsp;经典试题
          </el-button>
          <el-button @click="Jump('/login')">
            <el-icon :size="20">
              <Collection />
            </el-icon>
            &nbsp;&nbsp;&nbsp;成绩查询
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row
      style="display: flex; margin: auto; width: 1250px; min-width: 1250px; max-width: 1250px; background-color: #ffffff; height: 300px;">
      <el-col style="margin-top: 1%; margin-left: 1%; max-width: 98%; min-width: 98%; height: 100%; border-radius: 2px;
				border: 1px solid #e2d9b4; background-color: #f8f5ee;">
        <div style="display: flex; margin: auto; width: 100%; height: 17%; background-color: #ebe4d4;">
          <el-divider
            style="margin-left: 1%; margin-top: 1.2%; border-color: #784f3c; border-width: thick; height: 43%;"
            direction="vertical" />
          <span style="display: flex; margin-top: 1%; margin-left: 0.5%; font-size: 18px; color: #784f3c;">校园风采</span>
        </div>
        <el-carousel type="card" height="200px" indicator-position="none" arrow="never" style="margin-top: 2%;">
          <el-carousel-item v-for="item in srcList" :key="item">
            <el-image style="width: 450px; height: 200px" :src="item" fit="cover" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-row
      style="display: flex; margin: auto; width: 1250px; min-width: 1250px; max-width: 1250px; background-color: #ffffff; height: 220px;">
      <el-col style="margin-top: 1%; margin-left: 1%; max-width: 98%; min-width: 98%; height: 100%; border-radius: 2px;
				border: 1px solid #e2d9b4; background-color: #f8f5ee;">
        <div style="display: flex; margin: auto; width: 100%; height: 50px; background-color: #ebe4d4;">
          <el-divider
            style="margin-left: 1%; margin-top: 1.2%; border-color: #784f3c; border-width: thick; height: 42%;"
            direction="vertical" />
          <span style="display: flex; margin-top: 1%; margin-left: 0.5%; font-size: 18px; color: #784f3c;">友情链接</span>
        </div>
        <el-row :gutter="12" style="margin-left: 0.1%; margin-top: 1.5%; height: 100px;">
          <el-col :span="5">
            <el-image src="/image/lianjie/1.jpg" fit="cover" />
          </el-col>
          <el-col :span="5">
            <el-image src="/image/lianjie/2.jpg" fit="cover" />
          </el-col>
          <el-col :span="5">
            <el-image src="/image/lianjie/3.jpg" fit="cover" />
            <!-- <el-card style="height: 100%;" shadow="never">
							<el-image style="width: 100%; height: 100%;" src="/image/lianjie/3.jpg" fit="cover" />
						</el-card> -->
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="row-background" style="height: 20px;">

    </el-row>
    <Footer></Footer>
    <!-- <template>
			Scroll down to see the bottom-right button.
			<el-backtop :right="100" :bottom="100" />
		</template> -->
  </el-scrollbar>
</template>

<script>
import { read } from '../utils/cache.js'
import images from '../assets/page_login/bg.json'

export default {

  data() {
    return {
      images,
      activeIndex: '1',
      redirect: '',
      ylinput: '',
      loginId: '',
      loginPwd: '',
      savePwd: false,
      url: '../src/assets/image/44.webp',
      showContent: true, // 控制内容显示与否的变量
      showContent2: false, // 控制内容显示与否的变量
      showContent3: false, // 控制内容显示与否的变量
      srcList: [
        '/image/school/11.jpg',
        '/image/school/22.jpg',
        '/image/school/33.jpg',
        '/image/school/44.jpg',
        '/image/school/55.jpg',
        '/image/school/66.jpg',
        '/image/school/77.jpg',
        '/image/school/88.jpg',
      ],
      tableData: [{
        date: '2016-05-03',
        name: '家长生涯人物进课堂活动',
      },
      {
        date: '2016-05-02',
        name: '我校举办学生发展指导专题讲座',
      },
      {
        date: '2016-05-04',
        name: '选课走班学习 促进学生多元化发展',
      },
      {
        date: '2016-05-01',
        name: '自主命题，首先考的是考官',
      },
      {
        date: '2016-05-01',
        name: '纯洁学术生态离不开人才规范管理',
      },
      {
        date: '2016-05-01',
        name: '在劳动教育中涵泳奋斗精神',
      },
      {
        date: '2019-06-19',
        name: '学者谈如何让思政课接地气入人心',
      }
      ],
      tableData1: [{
        date: '2016-05-03',
        name: '清华大学-深圳医学科学院/深圳湾实验室联合培养博士专项...',
      }],
      tableData2: [{
        date: '2016-05-03',
        name: '那些你不知道的考研指南',
      },
      {
        date: '2016-05-02',
        name: '非全日制研究生报考遇冷',
      },
      {
        date: '2016-05-04',
        name: '自主命题，首先考的是考官',
      },
      {
        date: '2016-05-01',
        name: '考研试卷雷同系严重责任事故',
      },
      {
        date: '2016-05-01',
        name: '探索社会教育新路子',
      },
      {
        date: '2016-05-01',
        name: '中国非985工程大学排行榜100强',
      },
      {
        date: '2019-06-19',
        name: '科技为音乐教育插上翅膀',
      }
      ],
      tableData3: [{
        date: '2016-05-03',
        name: '党员干部要做明荣辱扬正气的楷模',
      },
      {
        date: '2016-05-02',
        name: '重温入党誓词 庆祝党的生日',
      },
      {
        date: '2016-05-04',
        name: '重温入党誓词 庆祝党的生日',
      },
      {
        date: '2016-05-01',
        name: '深入贯彻落实全国教育大会精神',
      },
      {
        date: '2016-05-01',
        name: '加强教职工思想政治建设',
      },
      {
        date: '2016-05-01',
        name: '我校党委组织各党支部开展教育精神提炼活动',
      },
      {
        date: '2019-06-19',
        name: '中国共产党党旗党徽制作和使用的若干规定',
      }
      ],
      tableData4: [{
        date: '2016-05-03',
        name: '我校开展防震防灾安全教育活动',
      },
      {
        date: '2016-05-02',
        name: '我校开展学生心理指导讲座',
      },
      {
        date: '2016-05-04',
        name: '我校举行“远离毒品之害” 专家讲堂活动',
      },
      {
        date: '2016-05-01',
        name: '我校举行防灾“119” 消防安全培训',
      },
      {
        date: '2016-05-01',
        name: '我校举行活动《校园危机干预》主题工作坊',
      },
      {
        date: '2016-05-01',
        name: '我校召开“共创平安校园”主题校会',
      },
      {
        date: '2019-06-19',
        name: '我校学生参加公益音乐会',
      }
      ]
    }
  },
  mounted() {
    this.scrollHeight = window.innerHeight * 0.7 + 'px';
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
        }
      },
      immediate: true
    }
  },
  created() {
    let result = read('local', this.$route.path)
    if (result) {
      result = JSON.parse(result)
      this.loginId = result.loginId
      this.loginPwd = result.loginPwd
      this.savePwd = true
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      document.documentElement.scrollTop = 0
      // console.log(key, keyPath);
    },
    /* moralRowClick(row, column, event) {
      console.log('行点击事件触发，行数据:', row);
      // 在这里处理你的行点击逻辑
      this.$router.push('/news/campusinfo-one')
    }, */
    handleMouseEnter(event) {
      // 鼠标悬停时的处理逻辑
      this.showContent = true
      this.showContent2 = false
      this.showContent3 = false
    },
    handleMouseEnter2(event) {
      this.showContent = false
      this.showContent2 = true
      this.showContent3 = false
    },
    handleMouseEnter3(event) {
      this.showContent = false
      this.showContent2 = false
      this.showContent3 = true
    },
    Jump(module) {
      this.$router.push(module)
    }
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column;
  /* 垂直排列 */
  justify-content: space-between;
  /* 上下间距 */
  align-items: flex-start;
  /* 水平方向上对齐 */
  row-gap: 10px;
  /* 垂直间距 */
  /* 如果需要兼容更老的浏览器，可以使用以下属性代替row-gap: */
  /* margin: 10px 0; */

  .el-button {
    margin-left: 20px;
    margin-top: 20px;
    background-color: #f3efe3;
    color: #784f3c;
    height: 50px;
    width: 280px;
    font-size: 15px;
  }
}
</style>

<style lang="scss" scoped>
.row-background {
  display: flex;
  margin: auto;
  width: 1250px;
  min-width: 1250px;
  max-width: 1250px;
  background-color: #ffffff;
}

.btn-style {
  margin-top: 0.6%;
  width: 24%;
  max-width: 24%;
  min-width: 24%;
  height: 100%;
  max-height: 100px;
  border-radius: 0px;
  background-repeat: no-repeat;
  background-size: cover;
}

.row-background-col {
  margin-left: 1%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #e2d9b4;
  background-color: #f8f5ee;
  max-width: 35%;
  min-width: 35%;
}

.row-background-div {
  display: flex;
  margin: auto;
  width: 100%;
  height: 11%;
  background-color: #ebe4d4;

  .el-divider {
    margin-left: 4%;
    margin-top: 3%;
    border-color: #784f3c;
    border-width: thick;
    height: 43%;
  }
}

.row-col-thin {
  margin-left: 1%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #e2d9b4;
  background-color: #f8f5ee;
  max-width: 26%;
  min-width: 26%;
}

.row-col-thin-div {
  display: flex;
  margin: auto;
  width: 100%;
  height: 11%;
  background-color: #ebe4d4;

  .el-divider {
    margin-left: 4%;
    margin-top: 4%;
    border-color: #784f3c;
    width: 2%;
    border-width: thick;
    height: 43%;
  }
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

/* .el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n + 1) {
		background-color: #d3dce6;
	} */


.el-sub-menu__title {
  font-size: 16px;
}

.image__load {
  width: 1250px;
  margin: auto;

  .el-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .overlay {
    position: absolute;
    /* 覆盖物必须有绝对定位 */
    top: 10%;
    left: 34%;
    width: 30%;
    height: 60%;
  }

  .overlay-one {
    position: absolute;
    /* 覆盖物必须有绝对定位 */
    top: 15%;
    left: 20%;
    width: 30%;
    height: 55%;
  }

  .overlay-two {
    position: absolute;
    /* 覆盖物必须有绝对定位 */
    top: 70%;
    left: 40%;
    width: 10%;
    height: 30%;
  }

  .overlay-text {
    position: absolute;
    /* 将文本放置于容器内部 */
    top: 83%;
    /* 距离容器顶部的百分比值 */
    left: 50%;
    /* 距离容器左侧的百分比值 */
    transform: translate(-50%, -50%);
    /* 水平居中与垂直居中 */
    color: white;
    /* 文字颜色 */
    font-size: 20px;
    /* 文字大小 */
    background-color: rgba(0, 0, 0, 0);
    /* 文字所在区域的背景透明度 */
    padding: 10px;
    /* 文字周围的间距 */
  }
}
</style>

<style lang="scss" scoped>
.page-header {
  background: rgba(44, 44, 44, 0.2);
  height: 100vh;
  max-height: 1050px;

  .page-header-image {
    background-image: url('../assets/page_login/bg.jpg');
    position: absolute;
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .container {
    max-width: 960px;
    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;
    width: 100%;
    height: 100%;
    z-index: 2;
    text-align: center;
    position: relative;

    .content-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 0 15px;
      color: #FFFFFF;
      width: 100%;
      max-width: 880px;
    }

    .card {
      border: 0;
      display: inline-block;
      position: relative;
      overflow: hidden;
      width: 100%;
      margin-bottom: 20px;
      background: transparent;
      box-shadow: none;
      border-radius: 0.25rem;
      padding-bottom: 0.7rem;
      max-width: 320px;
    }

    .logo-container {
      width: 85px;
      margin: 0 auto;
      margin-bottom: 40px;

      img {
        width: 100%;
      }
    }

    .form {
      .input-group {
        position: relative;
        display: flex;
        width: 100%;
        margin-bottom: 10px;
        border-radius: 30px;
        transition: all .3s;

        &:focus-within {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .input-group-addon {
          margin-bottom: 0;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.25;
          text-align: center;
          transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
          border-radius: 30px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          padding: 15px 0 15px 19px;
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-control {
          flex: 1 1 auto;
          background-color: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 12px;
          padding: 15px 18px 15px 16px;
          border-left: 0 none;
          border: medium none;
          border-radius: 30px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
        }

        .form-control::-webkit-input-placeholder {
          color: #C0C0C0;
        }

        .form-control:-moz-placeholder {
          color: #C0C0C0;
        }

        .form-control::-moz-placeholder {
          color: #C0C0C0;
        }

        .form-control:-ms-input-placeholder {
          color: #C0C0C0;
        }
      }

      .footer.text-center {
        text-align: center;

        .btn {
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          user-select: none;
          transition: all .15s ease-in-out;
          display: block;
          font-weight: 400;
          line-height: 1.35em;
          margin: 5px 1px;
          border: none;
          cursor: pointer;
          background-color: #6697fb;
          color: #FFFFFF;
          border-width: 1px;
          border-radius: 30px;
          font-size: 1em;
          padding: 12px 48px;
          text-decoration: none;

          &:hover {
            background-color: #76a7ff;
            box-sizing: 0 0 10px #333;
          }
        }
      }
    }
  }

  &::before {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: block;
    left: 0;
    top: 0;
    content: "";
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
<style scoped>
.bg {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus~label,
.login-box .user-box input:valid~label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}

.login-box a:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4,
    0 0 25px #03e9f4,
    0 0 50px #03e9f4,
    0 0 100px #03e9f4;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}

.apply {
  position: absolute;
  right: 0;
  font-size: 13px;
  color: #778;
  cursor: pointer;
  transition: color .2s;
  display: flex;
  align-items: center;
}

.apply:hover {
  color: #99a;
}

.apply .el-icon {
  margin-right: 5px;
}
</style>
