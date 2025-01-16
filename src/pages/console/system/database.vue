<template>
  <div class="d-flex flex-column ga-4">
    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="one">数据源</v-tab>
        <v-tab value="two">数据驱动</v-tab>
        <v-tab value="three">SQL监控</v-tab>
        <v-tab value="four">SQL防火墙</v-tab>
        <v-tab value="five">Web应用</v-tab>
        <v-tab value="six">URI监控</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in basic" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-tabs-window-item>

          <v-tabs-window-item value="two">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in datasource" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-tabs-window-item>

          <v-tabs-window-item value="three">
            <v-table fixed-header height="calc(100vh - 180px)">
              <thead>
                <tr>
                  <th class="text-left">
                    N
                  </th>
                  <th>
                    SQL
                  </th>
                  <th class="text-left">
                    ExecuteCount
                  </th>
                  <th class="text-left">
                    ExecuteTimeMillis
                  </th>
                  <th class="text-left">
                    MaxTimespan
                  </th>
                  <th class="text-left">
                    Txn
                  </th>
                  <th class="text-left">
                    ErrorCount
                  </th>
                  <th class="text-left">
                    UpdateCount
                  </th>
                  <th class="text-left">
                    FetchRowCount
                  </th>
                  <th class="text-left">
                    RunningCount
                  </th>
                  <th class="text-left">
                    ConcurrentMax
                  </th>
                  <th class="text-left">
                    ExecHisto
                  </th>
                  <th class="text-left">
                    ExecRsHisto
                  </th>
                  <th class="text-left">
                    FetchRowHisto
                  </th>
                  <th class="text-left">
                    UpdateHisto
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in sqlStat" :key="item.ID">
                  <td>{{ item.ID }}</td>
                  <td>{{ item.SQL }}</td>
                  <td>{{ item.ExecuteCount }}</td>
                  <td>{{ item.TotalTime }}</td>
                  <td>{{ item.MaxTimespan }}</td>
                  <td>{{ item.InTransactionCount == 0 ? "" : item.InTransactionCount }}</td>
                  <td>{{ item.ErrorCount == 0 ? "" : item.ErrorCount }}</td>
                  <td>{{ item.EffectedRowCount == 0 ? "" : item.EffectedRowCount }}</td>
                  <td>{{ item.FetchRowCount == 0 ? "" : item.FetchRowCount }}</td>
                  <td>{{ item.RunningCount == 0 ? "" : item.RunningCount }}</td>
                  <td>{{ item.ConcurrentMax }}</td>
                  <td>{{ item.Histogram }}</td>
                  <td>{{ item.ExecuteAndResultHoldTimeHistogram }}</td>
                  <td>{{ item.FetchRowCountHistogram }}</td>
                  <td>{{ item.EffectedRowCountHistogram }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-tabs-window-item>

          <v-tabs-window-item value="four">
            <span class="text-h6">Wall Stat</span>
            <v-container max-width="100%">
              <v-row no-gutters class="border-md border-b-0">
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    CheckCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.checkCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    HardCheckCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.hardCheckCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    ViolationCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.violationCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    SyntaxErrorCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.syntaxErrorCount }}
                  </v-sheet>
                </v-col>
                <v-responsive width="100%"></v-responsive>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    BlackListHitCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.blackListHitCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    BlackListSize
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.blackListSize }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    WhiteListHitCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.whiteListHitCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    WhiteListSize
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ wall.whiteListSize }}
                  </v-sheet>
                </v-col>
              </v-row>
            </v-container>
            <span class="text-h6">Table Stat</span>
            <v-table class="pt-4">
              <thead>
                <tr :style="{ backgroundColor: '#E5E5E5' }">
                  <th class="text-left text-caption font-weight-black">
                    Number
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    TableName
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    SelectCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    SelectIntoCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    InsertCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    UpdateCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    DeleteCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    TruncateCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    CreateCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    AlterCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    DropCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    ReplaceCount
                  </th>
                  <th class="text-left">
                    DeleteDataCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    DeleteHisto
                    [ - - - - - - ]
                  </th>
                  <th class="text-left">
                    UpdateDataCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    UpdateHisto
                    [ - - - - - - ]
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    FetchRowCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    FetchRowHisto
                    [ - - - - - - ]
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in wall.tables" :key="item.key">
                  <td class="text-caption">{{ index + 1 }}</td>
                  <td class="text-caption">{{ item.name }}</td>
                  <td class="text-caption">{{ item.selectCount }}</td>
                  <td class="text-caption">{{ item.selectIntoCount }}</td>
                  <td class="text-caption">{{ item.insertCount == null ? "" : item.insertCount }}</td>
                  <td class="text-caption">{{ item.updateCount }}</td>
                  <td class="text-caption">{{ item.deleteCount }}</td>
                  <td class="text-caption">{{ item.truncateCount }}</td>
                  <td class="text-caption">{{ item.createCount }}</td>
                  <td class="text-caption">{{ item.alterCount }}</td>
                  <td class="text-caption">{{ item.dropCount }}</td>
                  <td class="text-caption">{{ item.replaceCount }}</td>
                  <td class="text-caption">{{ item.deleteDataCount }}</td>
                  <td class="text-caption">{{ item.deleteDataCountHistogram }}</td>
                  <td class="text-caption">{{ item.updateDataCount }}</td>
                  <td class="text-caption flex-grow-1">{{ item.updateDataCountHistogram }}</td>
                  <td class="text-caption">{{ item.fetchRowCount }}</td>
                  <td class="text-caption">{{ item.fetchRowCountHistogram }}</td>
                </tr>
              </tbody>
            </v-table>
            <div class="text-h6 pt-4">Function Stat</div>
            <v-table class="pt-4">
              <thead>
                <tr :style="{ backgroundColor: '#E5E5E5' }">
                  <th class="text-left">
                    Function Name
                  </th>
                  <th class="text-left">
                    InvokeCount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item) in wall.functions" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.invokeCount }}</td>
                </tr>
              </tbody>
            </v-table>
            <div class="text-h6 pt-4">SQL Stat - White List</div>
            <v-table class="pt-4">
              <thead>
                <tr :style="{ backgroundColor: '#E5E5E5' }">
                  <th class="text-left text-caption font-weight-black">
                    Number
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    SQL
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    Sample
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    ExecuteCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    ExecuteErrorCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    FetchRowCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    UpdateCount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in wall.whiteList" :key="item.key">
                  <td class="text-caption">{{ index + 1 }}</td>
                  <td class="text-caption">{{ item.sql }}</td>
                  <td class="text-caption">{{ item.sample }}</td>
                  <td class="text-caption">{{ item.executeCount == null ? "" : item.executeCount }}</td>
                  <td class="text-caption">{{ item.executeErrorCount }}</td>
                  <td class="text-caption">{{ item.fetchRowCount }}</td>
                  <td class="text-caption">{{ item.updateCount }}</td>
                </tr>
              </tbody>
            </v-table>
            <div class="text-h6 pt-4">SQL Stat - Black List</div>
            <v-table class="pt-4">
              <thead>
                <tr :style="{ backgroundColor: '#E5E5E5' }">
                  <th class="text-left">
                    Number
                  </th>
                  <th class="text-left">
                    SQL
                  </th>
                  <th class="text-left">
                    Sample
                  </th>
                  <th class="text-left">
                    violationMessage
                  </th>
                  <th class="text-left">
                    ExecuteCount
                  </th>
                  <th class="text-left">
                    FetchRowCount
                  </th>
                  <th class="text-left">
                    UpdateCount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in wall.blackList" :key="item.key">
                  <td class="text-caption">{{ index + 1 }}</td>
                  <td class="text-caption">{{ item.sql }}</td>
                  <td class="text-caption">{{ item.sample }}</td>
                  <td class="text-caption">{{ item.violationMessage }}</td>
                  <td class="text-caption">{{ item.executeCount == null ? "" : item.executeCount }}</td>
                  <td class="text-caption">{{ item.fetchRowCount }}</td>
                  <td class="text-caption">{{ item.updateCount }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-tabs-window-item>

          <v-tabs-window-item value="five">
            <span class="text-h6">WebAppStat List</span>
            <v-container max-width="100%">
              <v-row no-gutters class="border-md border-b-0">
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    ContextPath
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.ContextPath }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    RunningCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.RunningCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    ConcurrentMax
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.ConcurrentMax }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    RequestCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.RequestCount }}
                  </v-sheet>
                </v-col>
                <v-responsive width="100%"></v-responsive>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    SessionCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.SessionCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    CommitCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.JdbcCommitCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    RollbackCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.JdbcRollbackCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    JdbcExecuteCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.JdbcExecuteCount }}
                  </v-sheet>
                </v-col>
                <v-responsive width="100%"></v-responsive>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    JdbcExecTimeMillis
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.JdbcExecuteTimeMillis }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    FetchRowCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.JdbcFetchRowCount }}
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
                    :style="{ backgroundColor: '#E5E5E5' }">
                    UpdateCount
                  </v-sheet>
                </v-col>
                <v-col class="border-b-md">
                  <v-sheet class="pa-2">
                    {{ webapp.JdbcUpdateCount }}
                  </v-sheet>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>

          <v-tabs-window-item value="six">
            <v-table fixed-header height="calc(100vh - 180px)">
              <thead>
                <tr>
                  <th class="text-left text-caption font-weight-black">
                    N
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    URI
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    RequestCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    RequestTimeMillisTotal
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    RequestTimeMillisMax
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    RunningCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    ConcurrentMax
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    JdbcExecuteCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    JdbcExecErrorCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    JdbcExecTimeMillis
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    CommitCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    RollbackCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    FetchRowCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    UpdateCount
                  </th>
                  <th class="text-left text-caption font-weight-black">
                    Histogram
                    [ - - - - - - - - ]
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in weburi" :key="item.ID">
                  <td class="text-caption">{{ index + 1 }}</td>
                  <td class="text-caption">{{ item.URI }}</td>
                  <td class="text-caption">{{ item.RequestCount }}</td>
                  <td class="text-caption">{{ item.RequestTimeMillis }}</td>
                  <td class="text-caption">{{ item.RequestTimeMillisMax }}</td>
                  <td class="text-caption">{{ item.RunningCount == 0 ? "" : item.RunningCount }}</td>
                  <td class="text-caption">{{ item.ConcurrentMax == 0 ? "" : item.ConcurrentMax }}</td>
                  <td class="text-caption">{{ item.JdbcExecuteCount == 0 ? "" : item.JdbcExecuteCount }}</td>
                  <td class="text-caption">{{ item.JdbcExecuteErrorCount == 0 ? "" : item.JdbcExecuteErrorCount }}</td>
                  <td class="text-caption">{{ item.JdbcExecuteTimeMillis == 0 ? "" : item.JdbcExecuteTimeMillis }}</td>
                  <td class="text-caption">{{ item.JdbcCommitCount == 0 ? "" : item.JdbcCommitCount }}</td>
                  <td class="text-caption">{{ item.JdbcRollbackCount == 0 ? "" : item.JdbcRollbackCount }}</td>
                  <td class="text-caption">{{ item.JdbcFetchRowCount == 0 ? "" : item.JdbcFetchRowCount }}</td>
                  <td class="text-caption">{{ item.JdbcUpdateCount == 0 ? "" : item.JdbcUpdateCount }}</td>
                  <td class="text-caption">{{ item.Histogram }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { SystemApi } from '@/api/system';
  import { onMounted, ref } from 'vue';

  const basic = ref()
  const datasource = ref()
  const sqlStat = ref()
  const websession = ref()
  const wall = ref()
  const webapp = ref()
  const weburi = ref()
  const tab = ref()

  const load = async () => {
    const basicRes = await SystemApi.basic() as any
    if (basicRes) {
      basic.value = Object.keys(basicRes).map(key => {
        return {
          name: key,
          value: basicRes[key],
        }
      })
    }
    const datasourceRes = await SystemApi.datasource() as any
    if (datasourceRes && datasourceRes[0]) {
      datasource.value = Object.keys(datasourceRes[0]).map(key => {
        return {
          name: key,
          value: datasourceRes[0][key],
        }
      })
    }

    const sqlStatRes = await SystemApi.sql() as any
    if (sqlStatRes) {
      sqlStat.value = Object.keys(sqlStatRes).map(key => {
        return {
          ID: sqlStatRes[key].ID,
          SQL: sqlStatRes[key].SQL,
          ExecuteCount: sqlStatRes[key].ExecuteCount,
          TotalTime: sqlStatRes[key].TotalTime,
          MaxTimespan: sqlStatRes[key].MaxTimespan,
          InTransactionCount: sqlStatRes[key].InTransactionCount,
          ErrorCount: sqlStatRes[key].ErrorCount,
          EffectedRowCount: sqlStatRes[key].EffectedRowCount,
          FetchRowCount: sqlStatRes[key].FetchRowCount,
          RunningCount: sqlStatRes[key].RunningCount,
          ConcurrentMax: sqlStatRes[key].ConcurrentMax,
          Histogram: sqlStatRes[key].Histogram,
          ExecuteAndResultHoldTimeHistogram: sqlStatRes[key].ExecuteAndResultHoldTimeHistogram,
          FetchRowCountHistogram: sqlStatRes[key].FetchRowCountHistogram,
          EffectedRowCountHistogram: sqlStatRes[key].EffectedRowCountHistogram
        }
      })
    }

    const wallRes = await SystemApi.wall() as any
    if (wallRes) {
      wall.value = wallRes
    }

    const webappRes = await SystemApi.webapp() as any
    if (webappRes) {
      webapp.value = webappRes[0]
    }

    const weburiRes = await SystemApi.weburi() as any
    if (weburiRes) {
      weburi.value = weburiRes
    }

    const sessionRes = await SystemApi.websession() as any
    if (sessionRes) {
      websession.value = sessionRes
    }
  }

  onMounted(() => {
    load()
  })
</script>

<style scoped>


</style>
