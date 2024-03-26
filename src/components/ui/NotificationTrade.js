import React from "react";
import guitar from "assets/img/nfts/acoustic-guitar-grey.jpg";

const TradeNotification = ({ notification, onClick }) => {
  return (
    <button
      className="flex w-full items-center rounded-lg bg-indigo-50 px-3"
      onClick={onClick}
    >
      <div className="flex h-full w-[55px] items-center justify-center rounded-xl py-4 text-2xl text-white">
        {/* <BsArrowBarUp /> */}
        <img src={guitar} alt="" />
      </div>
      <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
        <div>
          <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
            {notification.senderName} sent an exchange request for{" "}
            {notification.instrument.title}
          </p>
          <a className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
            See more details
          </a>{" "}
        </div>
        <p className="font-base text-left text-xs text-gray-900 dark:text-white"></p>
      </div>
    </button>
  );
};

export default TradeNotification;