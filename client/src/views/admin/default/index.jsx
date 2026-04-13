import {
  Box, Flex, Grid, GridItem, Heading, Icon, IconButton,
  Progress, SimpleGrid, Text, Badge, Tooltip,
  useColorModeValue, CircularProgress, CircularProgressLabel,
  Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ViewIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import { HSeparator } from "components/separator/Separator";
import { LuBuilding2 } from "react-icons/lu";
import {
  MdAddTask, MdContacts, MdLeaderboard, MdEmail,
  MdPhone, MdTrendingUp, MdCheckCircle, MdPending,
  MdBarChart,
} from "react-icons/md";
import { getApi } from "services/api";
import ReportChart from "../reports/components/reportChart";
import Chart from "components/charts/LineChart.js";
import { HasAccess } from "../../../redux/accessUtils";
import PieChart from "components/charts/PieChart";
import CountUpComponent from "../../../../src/components/countUpComponent/countUpComponent";

// ─── Motion helpers ──────────────────────────────────────────
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const child = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ─── StatCard – hero top cards ────────────────────────────────
const StatCard = ({ label, value, icon, gradient, sub, onClick, delay }) => (
  <MotionBox {...fadeUp(delay)} whileHover={{ y: -6, scale: 1.02 }} style={{ cursor: "pointer" }} onClick={onClick}>
    <Box
      borderRadius="20px"
      bgGradient={gradient}
      p="24px"
      position="relative"
      overflow="hidden"
      boxShadow="0 8px 32px -8px rgba(0,0,0,0.22)"
      _hover={{ boxShadow: "0 16px 40px -8px rgba(0,0,0,0.3)" }}
      transition="box-shadow 0.25s ease"
      height="100%"
    >
      {/* Decorative blob */}
      <Box
        position="absolute" top="-20px" right="-20px"
        w="120px" h="120px" borderRadius="full"
        bg="rgba(255,255,255,0.12)"
        pointerEvents="none"
      />
      <Box
        position="absolute" bottom="-30px" left="20px"
        w="80px" h="80px" borderRadius="full"
        bg="rgba(255,255,255,0.07)"
        pointerEvents="none"
      />

      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="1px" color="whiteAlpha.800" mb={1}>
            {label}
          </Text>
          <Text fontSize="3xl" fontWeight="900" color="white" lineHeight="1" mb={1}>
            <CountUpComponent targetNumber={value} />
          </Text>
          {sub && (
            <Text fontSize="xs" color="whiteAlpha.800" fontWeight="500">{sub}</Text>
          )}
        </Box>
        <Box
          bg="rgba(255,255,255,0.2)"
          p={3} borderRadius="14px"
          backdropFilter="blur(6px)"
        >
          <Icon as={icon} w={6} h={6} color="white" />
        </Box>
      </Flex>

      <Flex mt={4} align="center" gap={1}>
        <Icon as={ArrowForwardIcon} color="whiteAlpha.800" w={3} h={3} />
        <Text fontSize="xs" color="whiteAlpha.800" fontWeight="600">View all</Text>
      </Flex>
    </Box>
  </MotionBox>
);

// ─── MiniStat – lead/task breakdown tiles ─────────────────────
const MiniStat = ({ label, value, color, bg, onClick, pct }) => (
  <MotionBox
    whileHover={{ y: -3, boxShadow: `0 8px 24px -6px ${color}55` }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    cursor="pointer"
  >
    <Box bg={bg} borderRadius="14px" p={3} border="1.5px solid" borderColor={`${color}33`} position="relative" overflow="hidden">
      <Box position="absolute" top={0} left={0} h="3px" w={`${Math.min(pct, 100)}%`} bg={color} borderRadius="full" />
      <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.6px" color={color} mb={1}>{label}</Text>
      <Text fontSize="22px" fontWeight="900" color={color} lineHeight="1">
        <CountUpComponent targetNumber={value} />
      </Text>
      {pct !== undefined && (
        <Text fontSize="10px" color={color} opacity={0.75} mt={0.5} fontWeight="600">{Math.round(pct)}% of total</Text>
      )}
    </Box>
  </MotionBox>
);

// ─── TaskRow – individual task status bar ─────────────────────
const TaskRow = ({ name, count, total, color, delay }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <MotionBox {...fadeUp(delay)}>
      <Flex justify="space-between" align="center" mb={1}>
        <Flex align="center" gap={2}>
          <Box w="8px" h="8px" borderRadius="full" bg={color} />
          <Text fontSize="sm" fontWeight="600" color="gray.700">{name}</Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="800" color={color}>
            <CountUpComponent targetNumber={count} />
          </Text>
          <Badge
            fontSize="10px" px={1.5} py={0.5}
            borderRadius="full"
            bg={`${color}18`} color={color}
            fontWeight="700"
          >
            {Math.round(pct)}%
          </Badge>
        </Flex>
      </Flex>
      <Box bg="gray.100" borderRadius="full" h="6px" mb={2}>
        <MotionBox
          h="6px" borderRadius="full" bg={color}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 + delay }}
        />
      </Box>
    </MotionBox>
  );
};

// ─── ModuleStatRow – statistics bar list ──────────────────────
const ModuleStatRow = ({ item, maxVal, onClick, delay }) => {
  const pct = maxVal > 0 ? (item.length / maxVal) * 100 : 0;
  const colorMap = {
    Lead: "#422AFB", Contact: "#01B574", Task: "#4481EB",
    Property: "#f5a623", Email: "#e83e8c", Call: "#fd7e14",
    Meeting: "#6f42c1",
  };
  const color = colorMap[item.name] || "#422AFB";
  return (
    <MotionBox {...fadeUp(delay)} onClick={onClick} cursor="pointer"
      _hover={{ bg: "rgba(66,42,251,0.04)" }} borderRadius="10px" p={2} mx={-2}
      transition="background 0.2s"
    >
      <Flex justify="space-between" align="center" mb={1}>
        <Flex align="center" gap={2}>
          <Box w="8px" h="8px" borderRadius="full" bg={color} />
          <Text fontSize="sm" fontWeight="600" color="gray.700">{item.name}</Text>
        </Flex>
        <Text fontSize="sm" fontWeight="800" color={color}>
          <CountUpComponent targetNumber={item.length} />
        </Text>
      </Flex>
      <Box bg="gray.100" borderRadius="full" h="5px">
        <MotionBox
          h="5px" borderRadius="full"
          bg={`linear-gradient(to right, ${color}, ${color}99)`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + delay }}
        />
      </Box>
    </MotionBox>
  );
};

// ─── SectionHeading ───────────────────────────────────────────
const SectionHeading = ({ children, action }) => (
  <Flex justify="space-between" align="center" mb={4}>
    <Box>
      <Heading size="sm" fontWeight="800" color="secondaryGray.900" letterSpacing="-0.2px">
        {children}
      </Heading>
      <Box w="24px" h="2.5px" bg="linear-gradient(90deg,#422AFB,#7551FF)" borderRadius="full" mt={1} />
    </Box>
    {action}
  </Flex>
);

// ─── Main Dashboard ───────────────────────────────────────────
export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoding, setIsLoding] = useState(false);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const modules = useSelector((state) => state?.modules?.data);
  const [contactsView, taskView, leadView, proprtyView] = HasAccess(["Contacts", "Tasks", "Leads", "Properties"]);

  const leadModule   = modules?.find(({ moduleName }) => moduleName === "Leads");
  const contactModule = modules?.find(({ moduleName }) => moduleName === "Contacts");
  const propertiesModule = modules?.find(({ moduleName }) => moduleName === "Properties");
  const tasksModule  = modules?.find(({ moduleName }) => moduleName === "Tasks");
  const reportModule = modules?.find(({ moduleName }) => moduleName === "Reporting and Analytics");
  const emailModule  = modules?.find(({ moduleName }) => moduleName === "Emails");
  const callModule   = modules?.find(({ moduleName }) => moduleName === "Calls");

  const fetchData = useCallback(async () => {
    let responseData = await getApi(
      user?.role === "superAdmin" ? `api/status/` : `api/status/?createBy=${user?._id}`
    );
    setAllData(responseData?.data?.data);
  }, [user?._id, user?.role]);

  const fetchProgressChart = useCallback(async () => {
    setIsLoding(true);
    let result = await getApi(
      user?.role === "superAdmin"
        ? "api/reporting/line-chart"
        : `api/reporting/line-chart?createBy=${user?._id}`
    );
    if (result?.status === 200) setData(result?.data);
    setIsLoding(false);
  }, [user?._id, user?.role]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchProgressChart(); }, [fetchProgressChart]);

  const findModuleData = (title) => data?.find((i) => i?.name === title)?.length || 0;
  const findLeadStatus = (status) => allData?.leadData?.filter((i) => i?.leadStatus === status)?.length || 0;
  const findTaskStatus = (status) => allData?.taskData?.filter((i) => i?.status === status)?.length || 0;

  const totalLeads = allData?.leadData?.length || 0;
  const totalTasks = allData?.taskData?.length || 0;

  const navigateTo = {
    Lead: "/lead", Contact: "/contacts", Meeting: "/metting",
    Call: "/phone-call", Task: "/task", Email: "/email", Property: "/properties",
  };

  const taskStatuses = [
    { name: "Completed", status: "completed", color: "#01B574" },
    { name: "In Progress", status: "inProgress", color: "#7038db" },
    { name: "Todo", status: "todo", color: "#4481EB" },
    { name: "Pending", status: "pending", color: "#a37f08" },
    { name: "On Hold", status: "onHold", color: "#DB5436" },
  ].map((s) => ({ ...s, count: findTaskStatus(s.status) }));

  const completionRate = totalTasks > 0 ? Math.round((findTaskStatus("completed") / totalTasks) * 100) : 0;
  const activeLeadRate = totalLeads > 0 ? Math.round((findLeadStatus("active") / totalLeads) * 100) : 0;
  const maxModuleVal = data?.length > 0 ? Math.max(...data.map((d) => d.length || 0), 1) : 1;

  const cardGradients = [
    "linear(to-br, #4481EB, #04BEFE)",
    "linear(to-br, #422AFB, #7551FF)",
    "linear(to-br, #01B574, #05d68b)",
    "linear(to-br, #f5a623, #f7c35f)",
  ];

  const heroCards = [
    taskView?.view && tasksModule?.isActive && {
      label: "Total Tasks", value: findModuleData("Tasks"),
      icon: MdAddTask, gradient: cardGradients[0],
      sub: `${completionRate}% completion rate`,
      onClick: () => navigate("/task"), delay: 0,
    },
    contactsView?.view && contactModule?.isActive && {
      label: "Contacts", value: findModuleData("Contacts"),
      icon: MdContacts, gradient: cardGradients[1],
      sub: "Total contacts in CRM",
      onClick: () => navigate("/contacts"), delay: 0.08,
    },
    leadView?.view && leadModule?.isActive && {
      label: "Total Leads", value: findModuleData("Leads"),
      icon: MdLeaderboard, gradient: cardGradients[2],
      sub: `${activeLeadRate}% active rate`,
      onClick: () => navigate("/lead"), delay: 0.16,
    },
    proprtyView?.view && propertiesModule?.isActive && {
      label: "Properties", value: findModuleData("Properties"),
      icon: LuBuilding2, gradient: cardGradients[3],
      sub: "Listed properties",
      onClick: () => navigate("/properties"), delay: 0.24,
    },
  ].filter(Boolean);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>

      {/* ── Hero Stat Cards ──────────────────────────────────── */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: heroCards.length }} gap="20px" mb="24px">
        {heroCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </SimpleGrid>

      {/* ── Row 2: Charts ─────────────────────────────────────── */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5} mb="24px">

        {/* Module Data Line Chart */}
        <MotionBox {...fadeUp(0.1)}>
          <Card h="100%" borderRadius="20px" boxShadow="0 4px 24px -8px rgba(66,42,251,0.10)" border="1px solid" borderColor="rgba(66,42,251,0.08)" p={5}>
            <SectionHeading>Module Activity</SectionHeading>
            <Chart dashboard="dashboard" data={data} />
          </Card>
        </MotionBox>

        {/* Email & Call Report */}
        {(emailModule?.isActive || callModule?.isActive) && (
          <MotionBox {...fadeUp(0.18)}>
            <Card h="100%" borderRadius="20px" boxShadow="0 4px 24px -8px rgba(66,42,251,0.10)" border="1px solid" borderColor="rgba(66,42,251,0.08)" p={5}>
              <SectionHeading
                action={
                  reportModule?.isActive && (
                    <Tooltip label="View full report" hasArrow>
                      <IconButton
                        size="sm"
                        borderRadius="10px"
                        variant="ghost"
                        colorScheme="green"
                        icon={<ViewIcon />}
                        onClick={() => navigate("/reporting-analytics")}
                        aria-label="View report"
                      />
                    </Tooltip>
                  )
                }
              >
                {emailModule?.isActive && callModule?.isActive
                  ? "Email & Call Report"
                  : emailModule?.isActive ? "Email Report" : "Call Report"}
              </SectionHeading>
              <ReportChart dashboard="dashboard" />
            </Card>
          </MotionBox>
        )}
      </Grid>

      {/* ── Row 3: Stats panels ─────────────────────────────── */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} gap={5} mb="24px">

        {/* MODULE OVERVIEW */}
        {data && data.length > 0 && (
          <MotionBox {...fadeUp(0.1)}>
            <Card h="100%" borderRadius="20px" boxShadow="0 4px 24px -8px rgba(66,42,251,0.10)" border="1px solid" borderColor="rgba(66,42,251,0.08)" p={5}>
              <SectionHeading>Overview</SectionHeading>
              <Flex direction="column" gap={2}>
                {data.map((item, i) => (
                  <ModuleStatRow
                    key={i}
                    item={item}
                    maxVal={maxModuleVal}
                    onClick={() => navigate(navigateTo[item.name])}
                    delay={i * 0.06}
                  />
                ))}
              </Flex>
            </Card>
          </MotionBox>
        )}

        {/* LEAD STATISTICS */}
        {leadView?.view && leadModule?.isActive && (
          <MotionBox {...fadeUp(0.18)}>
            <Card h="100%" borderRadius="20px" boxShadow="0 4px 24px -8px rgba(66,42,251,0.10)" border="1px solid" borderColor="rgba(66,42,251,0.08)" p={5}>
              <SectionHeading>Lead Breakdown</SectionHeading>

              {/* Conversion ring */}
              <Flex justify="center" mb={4}>
                <CircularProgress
                  value={activeLeadRate}
                  size="120px"
                  thickness="10px"
                  color="green.400"
                  trackColor="gray.100"
                  capIsRound
                >
                  <CircularProgressLabel>
                    <Text fontSize="xl" fontWeight="900" color="gray.700">{activeLeadRate}%</Text>
                    <Text fontSize="9px" color="gray.400" fontWeight="600" mt="-2px">ACTIVE</Text>
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>

              <SimpleGrid columns={2} gap={3} mb={4}>
                <MiniStat label="Total" value={totalLeads} color="#4481EB" bg="#ebf5ff"
                  onClick={() => navigate("/lead")} pct={100} />
                <MiniStat label="Active" value={findLeadStatus("active")} color="#01B574" bg="#edfbf3"
                  onClick={() => navigate("/lead", { state: "active" })}
                  pct={totalLeads ? (findLeadStatus("active") / totalLeads) * 100 : 0} />
                <MiniStat label="Pending" value={findLeadStatus("pending")} color="#a37f08" bg="#fef9ec"
                  onClick={() => navigate("/lead", { state: "pending" })}
                  pct={totalLeads ? (findLeadStatus("pending") / totalLeads) * 100 : 0} />
                <MiniStat label="Sold" value={findLeadStatus("sold")} color="#DB5436" bg="#fff2ef"
                  onClick={() => navigate("/lead", { state: "sold" })}
                  pct={totalLeads ? (findLeadStatus("sold") / totalLeads) * 100 : 0} />
              </SimpleGrid>

              <Divider mb={4} />
              <Flex justify="center">
                <PieChart leadData={allData?.leadData} />
              </Flex>
            </Card>
          </MotionBox>
        )}

        {/* TASK STATISTICS */}
        {taskView?.view && tasksModule?.isActive && (
          <MotionBox {...fadeUp(0.26)}>
            <Card h="100%" borderRadius="20px" boxShadow="0 4px 24px -8px rgba(66,42,251,0.10)" border="1px solid" borderColor="rgba(66,42,251,0.08)" p={5}>
              <SectionHeading>Task Breakdown</SectionHeading>

              {/* Completion ring */}
              <Flex justify="center" mb={4}>
                <CircularProgress
                  value={completionRate}
                  size="120px"
                  thickness="10px"
                  color="green.400"
                  trackColor="gray.100"
                  capIsRound
                >
                  <CircularProgressLabel>
                    <Text fontSize="xl" fontWeight="900" color="gray.700">{completionRate}%</Text>
                    <Text fontSize="9px" color="gray.400" fontWeight="600" mt="-2px">DONE</Text>
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>

              {/* Total tasks chip */}
              <Flex
                justify="center" align="center"
                bg="rgba(68, 129, 235, 0.08)" borderRadius="12px"
                p={3} mb={4} cursor="pointer"
                onClick={() => navigate("/task")}
                _hover={{ bg: "rgba(68, 129, 235, 0.14)" }}
                transition="background 0.2s"
              >
                <Icon as={MdAddTask} color="#4481EB" w={5} h={5} mr={2} />
                <Text fontWeight="800" color="#4481EB" fontSize="sm">{totalTasks} Total Tasks</Text>
              </Flex>

              {/*Status bars */}
              <Flex direction="column" gap={1}>
                {taskStatuses.map((s, i) => (
                  <TaskRow
                    key={i}
                    name={s.name}
                    count={s.count}
                    total={totalTasks}
                    color={s.color}
                    delay={i * 0.07}
                  />
                ))}
              </Flex>
            </Card>
          </MotionBox>
        )}
      </Grid>

    </motion.div>
  );
}
