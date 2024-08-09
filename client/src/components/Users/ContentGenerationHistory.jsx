import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { FaRegEdit, FaTrashAlt, FaEye, FaPlusSquare } from "react-icons/fa";
import { userProfileAPI } from "../../apis/users/usersAPI";
import StatusMessage from "../Alert/StatusMessage";

const ContentGenerationHistory = () => {
  const { isLoading, data, isError, error } = useQuery({
        queryFn: userProfileAPI,
        queryKey: ["userProfile"],
  });

  if (isLoading) {
    return <StatusMessage type="loading" message="Loading, please wait..." />
  } else if (isError) {
    return <StatusMessage type="error" message={error.response.data.message} />
  } else {
    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                Content Generation History
            </h2>

            <Link
                className="mb-4 w-44 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center"
                to="/generate-content"
            >
                <FaPlusSquare className="mr-2" /> Create New Content
            </Link>
            {/* Content history list */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    { data?.user?.history <= 0 ? <h1>No history found</h1> : 
                        <ul className="divide-y divide-gray-200">
                            {data?.user?.history?.map(content => {
                                return (
                                    <li key={content._id} className="px-6 py-4 flex items-center justify-between space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {content.prompt}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(content?.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Link to={`/history/${content?._id}`}>
                                                <FaEye className="text-green-500 hover:text-green-600 cursor-pointer" />
                                            </Link>
                                        </div>
                                    </li>
                                )
                            })}
                            
                        </ul>
                    }
                </div>
            </div>
        </div>
    );
  }

};

export default ContentGenerationHistory;

