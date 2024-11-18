<template>
  <v-container class="pa-sm-6 pa-md-12" fluid>
    <v-responsive class="text-center mx-auto pb-4 border-b-sm" max-width="900">
      <p class="font-weight-medium text-primary">学校新闻</p>

      <p class="mt-2 text-h5 font-weight-bold text-md-h4">
        Geometry and Topology Seminar——The topology of manifolds with positive isotropic curvature
      </p>

      <p class="mt-4 text-body-1 text-medium-emphasis d-flex justify-center ga-4">
        <span class="d-flex align-self-center">
          <v-icon icon="mdi-clock-time-five"></v-icon>
          时间：2024-11-18 15:10-17:00
        </span>
        <span class="d-flex align-self-center">
          <v-icon icon="mdi-account"></v-icon>
          报告人: 黄红（北京师范大学）
        </span>
      </p>
    </v-responsive>
    <v-container>
      <pre style=" text-align: justify;" wrap="soft"><strong>Abstract:</strong> There are many interactions between geometry and topology. In this talk I will discuss one such example, which concerns the notion of positive isotropic curvature introduced by Micallef and Moore in 1988. I’ll mainly focus on the topological implications of this curvature condition. First I’ll briefly survey some of the previous works by various authors on Riemannian manifolds with positive isotropic curvature, including those by Brendle, Chen-Tang-Zhu, Fraser, Hamilton, et al. Then I’ll introduce my recent work on the topological classification of compact manifolds of dimension n ≥ 12 with positive isotropic curvature. The main tool is Ricci flow with surgery, which was used by Perelman to attack the Poincare conjecture and Thurston’s geometrization conjecture. Techniques from topology are also extensively used.
     </pre>
      <p style="text-align: justify;">&nbsp;</p>
    </v-container>
  </v-container>
</template>

<script setup>
const features = [
  {
    title: 'Push to deploy',
    subtitle:
      'Commodo nec sagittis tortor mauris sed. Turpis tortor quis scelerisque diam id accumsan nullam tempus. Pulvinar etiam lacus volutpat eu.',
    icon: 'mdi-cloud-upload',
  },
  {
    title: 'SSL certificates',
    subtitle:
      'Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh.',
    icon: 'mdi-lock',
  },
  {
    title: 'Simple queues',
    subtitle:
      'Pellentesque sit elit congue ante nec amet. Dolor aenean curabitur viverra suspendisse iaculis eget. Nec mollis placerat ultricies euismod ut condimentum.',
    icon: 'mdi-sync',
  },
]
</script>
