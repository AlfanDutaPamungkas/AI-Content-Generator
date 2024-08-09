import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaRegEdit, FaTrashAlt, FaRegClock, FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchSingleHistoryAPI } from "../../apis/users/usersAPI";
import StatusMessage from "../Alert/StatusMessage";

const HistoryDetails = () => {
  const {id} = useParams();

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['history', id],
    queryFn: () => fetchSingleHistoryAPI(id)
  });

  if (isLoading) {
    return <StatusMessage type="loading" message="Loading, please wait..." />
  } else if (isError) {
    return <StatusMessage type="error" message={error.response.data.message} />
  } else {
    return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden m-4">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">{data?.history?.prompt}</h2>
        <div className="flex items-center text-sm">
            <FaRegClock className="mr-2" />
            <span>{new Date(data?.history?.createdAt).toLocaleDateString()}</span>
        </div>
        </div>
        <div className="p-6">
            <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: data?.history?.content }}></div>
        </div>
    </div>
    );
  }
};

export default HistoryDetails;