import { Box, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import { CiBadgeDollar } from "react-icons/ci";
import { FaShareAlt } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FaStar } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AnalyticsHome = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState([]);

  const getAnalytics = async () => {
    const res = await axios.get(`/api/analytics/${user._id}`);
    setLoading(false);
    setAnalyticsData(res.data);
  };
  const totalLikes = analyticsData?.reduce((acc, ev) => acc + ev.totalLikes, 0);
  const totalComments = analyticsData?.reduce(
    (acc, ev) => acc + ev.totalComments,
    0
  );
  const totalSales = analyticsData?.reduce((acc, ev) => acc + ev.totalSales, 0);
  const totalMales = analyticsData?.reduce(
    (acc, ev) => acc + ev.numberOfMales,
    0
  );
  const totalFemales = analyticsData?.reduce(
    (acc, ev) => acc + ev.numberOfFemales,
    0
  );
  const genderRatio = totalFemales / totalMales;

  useEffect(() => {
    getAnalytics();
  }, [user]);

  const salesData = {
    labels: analyticsData.map((e) => {
      return e.eventid.name;
    }),
    datasets: [
      {
        label: "Sales",
        data: analyticsData.map((e) => {return e.totalSales}),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const likesData = {
    labels: analyticsData.map((e) => {
      return e.eventid.name;
    }),
    datasets: [
      {
        label: "Likes",
        data: analyticsData.map((e) => {
          return e.totalLikes;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const genderData = {
    labels: analyticsData.map((e) => {
      return e.eventid.name;
    }),
    datasets: [
      {
        label: "Female/Male Ratio",
        data: analyticsData.map((e) => {
          return e.numberOfFemales/e.numberOfMales;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Box>
      {loading ? (
        <Flex justify="center" mt={5}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {analyticsData.length < 1 ? (
            <Text>No Data Found</Text>
          ) : (
            <>
              <Grid
                gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr 1fr" }}
                ms={8}
                me={8}
                h={"7em"}
                gap={12}
                mt={5}
              >
                <Box bg={"blue.800"} color={"white"} p={5}>
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text fontSize={"lg"}>Earnings</Text>
                    <CiBadgeDollar size={25} />
                  </Flex>
                  <Text fontSize={"4xl"}>{totalSales}</Text>
                </Box>
                <Box
                  boxShadow="2xl"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  p={5}
                >
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text fontSize={"lg"}>Comments</Text>
                    <FaRegCommentDots size={25} />
                  </Flex>
                  <Text fontSize={"4xl"}>{totalComments}</Text>
                </Box>
                <Box
                  boxShadow="2xl"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  p={5}
                >
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text fontSize={"lg"}>Likes</Text>
                    <FcLike size={30} />
                  </Flex>
                  <Text fontSize={"4xl"}>{totalLikes}</Text>
                </Box>
                <Box
                  boxShadow="2xl"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  p={5}
                >
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text fontSize={"lg"}>Female/Male Ratio</Text>
                    <FaStar size={30} color="green" />
                  </Flex>
                  <Text fontSize={"4xl"}>{genderRatio}</Text>
                </Box>
              </Grid>
              <Flex maxH={"50vh"} ms={"auto"} justifyContent={"center"} mt={10}>
                <Bar data={salesData} options={options} />
              </Flex>
              <Flex maxH={"50vh"} ms={"auto"} justifyContent={"center"} mt={10}>
                <Bar data={likesData} options={options} />
              </Flex>
              <Flex maxH={"50vh"} ms={"auto"} justifyContent={"center"} mt={10}>
                <Bar data={genderData} options={options} />
              </Flex>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default AnalyticsHome;
