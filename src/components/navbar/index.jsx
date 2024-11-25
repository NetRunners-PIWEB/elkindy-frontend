import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import messageSound from "assets/sound/message.mp3";
import {fetchNotifications} from '../../services/exam/examService';

import { useLogoutMutation } from "../../slices/userApiSlice";

import { logout } from "../../slices/authSlice";

import NotificationStatus from "components/ui/NotificationStatus";
import TradeNotification from "components/ui/NotificationTrade";
import axios from "axios";
import { fetchUserData } from '../../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
const Navbar = (props) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsobs, setNotificationsobs] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [statusNotification, setStatusNotifications] = useState([]);
  const [itemNotification, setItemNotification] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const { onOpenSidenav, brandText, socket } = props;
  const [darkmode, setDarkmode] = React.useState(false);


  const navigate = useNavigate();


  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const { userData, isLoading, error } = useSelector((state) => state.user);
  const [userid, setuserid] = useState("")

  
// Fonction pour récupérer les notifications lors du chargement du composant
const getNotifications = async () => {
    try {
        const notifications = await fetchNotifications(userid);
        setNotificationsobs(notifications);
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    }
};

  useEffect(() => {
    dispatch(fetchUserData());
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [...prev, data]);
        const sound = new Audio(messageSound);
        sound.play();
        setShowDropdown(true);
      });
       socket.on('newobs', (data) => {
        console.log("ihebbb"+data)
        setNotificationsobs((prev) => [...prev, data]);
      });
      socket.on("getTradeStatus", (data) => {
        setStatusNotifications((prev) => [...prev, data]);
        const sound = new Audio(messageSound);
        sound.play();
        setShowDropdown(true);
      });
      socket.on("newInstrumentNotification", (data) => {
        setItemNotification((prev) => [...prev, data]);
        const sound = new Audio(messageSound);
        sound.play();
        setShowDropdown(true);
      });


    }

  const userid2 = localStorage.getItem("userid");
  setuserid(userid2);
  

if(userid!=""){
  console.log("innnn stateee");
  console.log(userid);
  getNotifications();
}
   
  
  }, [socket,dispatch]);
  
  if (!userData) {
    return <div>Loading...</div>;
  }

  const logoutHandler = async () => {
    try {
      dispatch(logout());
      navigate("/auth/sign-in");
    } catch (err) {
      console.error(err);
      console.log(props);
    }
  };
  

  const markAllRead = () => {
    setNotifications([]);
    setStatusNotifications([]);
    setShowDropdown(false);
  };



  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            class="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </p>
              </div>

              {notificationsobs.map((notification, index) => (
                  <p>{notification.message}</p>
))}

            {  notifications.map((notification, index) => (
                <TradeNotification
                  key={index}
                  notification={notification}
                  onClick={() => { }}
                />
              ))}
              {statusNotification.map((notification, index) => (
                <NotificationStatus
                  key={index}
                  status={notification.status}
                  onClick={() => { }}
                />
              ))}
              {itemNotification.map((notification, index) => (
                <div>
                  <h1>New item posted with your search preferences</h1>
                  <Link to={`/admin/marketplace/instrument/${notification.instrument._id}`}>See Instrument</Link>
                </div>
              ))}

              {/* <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button> */}
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
          show={showDropdown}
        />
        {/* start Horizon PRO */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          children={
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div
                style={{
                  backgroundImage: `url(${navbarimage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className="mb-2 aspect-video w-full rounded-lg"
              />
              <a
                target="blank"
                href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                Buy Horizon UI PRO
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/docs-tailwind/docs/react/installation?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
              >
                See Documentation
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-black hover:text-navy-700 dark:text-white dark:hover:text-white"
              >
                Try Horizon Free
              </a>
            </div>
          }
          classNames={"py-2 top-6 -left-[250px] md:-left-[330px] w-max"}
          animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
        />
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={userData.user.image}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, {userData.user.username}
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm font-medium text-red-500 transition duration-150 ease-out hover:text-red-500 hover:ease-in"
                  onClick={logoutHandler}
                >
                  Log Out
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
