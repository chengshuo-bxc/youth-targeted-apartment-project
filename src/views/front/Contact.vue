<template>
  <div class="contact-page">
    <!-- Banner -->
    <div class="page-banner">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <h1>联系我们</h1>
        <p>有任何疑问或需求，欢迎随时联系我们</p>
      </div>
    </div>

    <!-- 联系卡片 -->
    <div class="contact-grid">
      <div class="contact-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
          <el-icon :size="28" color="#fff"><Phone /></el-icon>
        </div>
        <h3>官方客服热线</h3>
        <p class="card-value">415-87777</p>
        <p class="card-desc">工作日 9:00 - 21:00 | 周末 10:00 - 18:00</p>
      </div>

      <div class="contact-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
          <el-icon :size="28" color="#fff"><User /></el-icon>
        </div>
        <h3>项目经理</h3>
        <p class="card-value">189-7556-0804</p>
        <p class="card-desc">项目对接、商务合作请直接联系</p>
      </div>

      <div class="contact-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">
          <el-icon :size="28" color="#fff"><Message /></el-icon>
        </div>
        <h3>电子邮箱</h3>
        <p class="card-value">service@youthapt.com</p>
        <p class="card-desc">24小时内回复您的邮件</p>
      </div>

      <div class="contact-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7);">
          <el-icon :size="28" color="#fff"><Location /></el-icon>
        </div>
        <h3>公寓地址</h3>
        <p class="card-value">郑州市高新区科学大道100号</p>
        <p class="card-desc">A栋/B栋/C栋/D栋/E栋/F栋</p>
      </div>
    </div>

    <!-- 留言表单 -->
    <div class="section">
      <h2 class="section-title">
        <span class="title-bar"></span>在线留言
      </h2>
      <div class="form-card">
        <el-form :model="form" label-width="100px" label-position="top" size="large">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="您的姓名">
                <el-input v-model="form.name" placeholder="请输入姓名" prefix-icon="User" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="form.phone" placeholder="请输入手机号" prefix-icon="Phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="问题类型">
            <el-radio-group v-model="form.type">
              <el-radio-button value="咨询">租房咨询</el-radio-button>
              <el-radio-button value="报修">维修报修</el-radio-button>
              <el-radio-button value="投诉">投诉建议</el-radio-button>
              <el-radio-button value="其他">其他</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="留言内容">
            <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请详细描述您的问题或需求..." maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="handleSubmit">
              <el-icon><Promotion /></el-icon> 提交留言
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="section">
      <h2 class="section-title">
        <span class="title-bar"></span>常见问题
      </h2>
      <div class="faq-grid">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="faq-card"
          :class="{ active: activeFaq === i }"
          @click="activeFaq = activeFaq === i ? -1 : i"
        >
          <div class="faq-header">
            <span class="faq-q">{{ faq.q }}</span>
            <el-icon class="faq-arrow"><ArrowDown /></el-icon>
          </div>
          <div class="faq-body" v-show="activeFaq === i">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Phone, User, Message, Location, Promotion, ArrowDown } from '@element-plus/icons-vue'

const form = reactive({
  name: '',
  phone: '',
  type: '咨询',
  content: ''
})

const activeFaq = ref(-1)

const faqs = [
  { q: '如何办理入住手续？', a: '入住当天携带本人身份证原件到公寓前台，签署租赁合同并缴纳首月租金及押金后，工作人员会带您验收房间并交付钥匙。全程约30分钟即可完成。' },
  { q: '租金支付方式有哪些？', a: '支持支付宝、微信支付、银行转账等多种方式。租金按月缴纳，每月1日前完成缴费即可。水电费按实际使用量每季度结算一次。' },
  { q: '退租需要提前多久申请？', a: '需提前30天书面申请退租。退租时公寓将安排房屋验收，扣除水电等实际费用后退还押金。验收合格后3个工作日内完成退款。' },
  { q: '公寓提供哪些配套设施？', a: '所有房间配备独立卫浴、空调、热水器、网络入户。公共区域设有洗衣房、健身房、快递柜、自动售货机等。部分楼栋配有共享厨房和自习室。' },
  { q: '可以短租吗？', a: '目前主要提供半年及以上的长租服务。短租需求请电话联系客服咨询，我们会在有空余房源时尽量安排。' },
]

function handleSubmit() {
  if (!form.name || !form.phone || !form.content) {
    ElMessage.warning('请填写完整的留言信息')
    return
  }
  ElMessage.success('留言提交成功！我们会尽快与您联系')
  form.name = ''
  form.phone = ''
  form.type = '咨询'
  form.content = ''
}
</script>

<style scoped>
.contact-page {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

.page-banner {
  position: relative;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 36px;
  background: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=300&fit=crop') center/cover;
}

.page-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(30, 47, 95, 0.75), rgba(79, 56, 150, 0.65));
}

.page-banner-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.page-banner-content h1 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-banner-content p {
  font-size: 15px;
  opacity: 0.9;
}

/* ===== Contact Cards ===== */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 48px;
}

.contact-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.contact-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.card-value {
  font-size: 20px;
  font-weight: 800;
  color: #303133;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.card-desc {
  font-size: 12px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
}

/* ===== Section ===== */
.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.title-bar {
  display: inline-block;
  width: 4px;
  height: 22px;
  background: linear-gradient(180deg, #409EFF, #667eea);
  border-radius: 2px;
}

/* ===== Form ===== */
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 36px 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* ===== FAQ ===== */
.faq-grid {
  display: grid;
  gap: 12px;
}

.faq-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.faq-card:hover,
.faq-card.active {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.faq-card.active {
  border-left: 3px solid #409EFF;
}

.faq-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
}

.faq-q {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.faq-arrow {
  font-size: 14px;
  color: #c0c4cc;
  transition: transform 0.3s;
}

.faq-card.active .faq-arrow {
  transform: rotate(180deg);
  color: #409EFF;
}

.faq-body {
  padding: 0 22px 18px;
}

.faq-body p {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin: 0;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
}
</style>
