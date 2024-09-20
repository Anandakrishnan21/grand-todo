"use client";
import React, { useEffect, useState } from "react";
import { RiDraggable } from "react-icons/ri";
import { LuAlarmClock } from "react-icons/lu";
import { message, Select } from "antd";
import Delete from "@/components/common/Delete";
import { Inbox } from "lucide-react";
import FileNotFound from "@/components/common/FileNotFound";
import { resolve } from "styled-jsx/css";
import Loading from "../Loading";

function Today() {
  const [todo, setTodo] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const showNotification = () => {
    messageApi.open({
      type: "success",
      content: "You have one task to do :)",
      duration: 10,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await fetch("/api/today", {
          cache: "no-cache",
        });
        if (!res.ok) {
          console.error("Error fetching data");
        }
        const data = await res.json();
        setTodo(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("en-GB");
  const todayTodos = todo.filter(
    (item) => item.date === today.replace(/\//g, "-")
  );

  const now = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    todayTodos.forEach((todo) => {
      if (todo.due === now) {
        showNotification();
      }
    });
  }, [now, todayTodos]);

  const handleFocus = (id) => {
    setEditingItemId(id);
  };

  const handleBlur = async (id, field, value) => {
    setEditingItemId(null);
    try {
      const res = await fetch("/api/today", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, [field]: value }),
      });
      if (res.ok) {
        message.success("Todo updated successfully");
      } else {
        message.error("Failed to update todo");
      }
      setTodo((prevTodos) =>
        prevTodos.map((item) =>
          item._id === id ? { ...item, [field]: value } : item
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div className="flex justify-center items-center pt-4">
      {contextHolder}
      <div className="w-screen lg:w-[60%] lg:h-[60%] p-2">
        <h1 className="font-bold text-xl">Today</h1>
        <span className="text-gray-600 pb-2">{todayTodos.length} tasks</span>
        {todayTodos.length > 0 ? (
          todayTodos.map((item, index) => (
            <div key={index} className="flex justify-between border-b p-2">
              <div className="flex gap-2">
                <RiDraggable size={20} />
                {item.status != "Done" ? (
                  <Delete id={item._id} setData={setTodo} />
                ) : (
                  ""
                )}
                <div className="flex flex-col">
                  <p
                    contentEditable
                    suppressHydrationWarning={true}
                    onFocus={() => handleFocus(item._id)}
                    onBlur={(e) =>
                      handleBlur(item._id, "description", e.target.innerText)
                    }
                    className={`${
                      editingItemId === item._id
                        ? "bg-blue-400 text-white p-1 border-dashed"
                        : ""
                    }`}
                  >
                    {item.description}
                  </p>
                  <span className="flex gap-1 items-center text-sm text-gray-600">
                    <Inbox size={16} /> inbox
                  </span>
                  <span className="text-sm text-gray-800">{item.tags}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <p
                  className={`${
                    item.priority === "high"
                      ? "text-red-500"
                      : item.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  } rounded-md px-1`}
                >
                  {item.priority}
                </p>
                <Select
                  defaultValue={item.status}
                  style={{ width: 120 }}
                  options={
                    item.status != "Done"
                      ? [
                          { value: "Todo", label: "Todo" },
                          { value: "Inprogress", label: "Inprogress" },
                          { value: "Done", label: "Done" },
                        ]
                      : [{ value: "Done", label: "Done" }]
                  }
                  onChange={(value) => handleBlur(item._id, "status", value)}
                />
                {item?.due ? item.due : ""}
                <LuAlarmClock size={20} />
              </div>
            </div>
          ))
        ) : (
          <FileNotFound />
        )}
      </div>
    </div>
  );
}

export default Today;
