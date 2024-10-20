"use client";
import React, { useState } from "react";
import { RiDraggable } from "react-icons/ri";
import { Select, message } from "antd";
import Delete from "@/components/common/Delete";
import UpdateTask from "@/components/common/UpdateTask";

function TodoItem({ item, setTodo }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState({});

  const handleFocus = (id, text) => {
    setEditingItemId(id);
    setEditingText({ [id]: text });
  };

  const handleBlur = async (id, field) => {
    setEditingItemId(null);
    const value = editingText[id];
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

  return (
    <div className="flex flex-col md:flex-row justify-between gap-2">
      <div className="flex items-center gap-2">
        <RiDraggable size={20} />
        {item.status !== "Done" && <Delete id={item._id} setData={setTodo} />}
        <div className="flex text-sm flex-col">
          <input
            value={editingText[item._id] || item.description}
            onFocus={() => handleFocus(item._id, item.description)}
            onChange={(e) => setEditingText({ [item._id]: e.target.value })}
            onBlur={() => handleBlur(item._id, "description")}
            className={`${
              editingItemId === item._id ? "bg-blue-400 p-1" : "p-1"
            } w-full font-semibold capitalize rounded-md`}
          />
          <span className="text-gray-800">{item.tags}</span>
          <p>
            Time:{" "}
            <span>
              {item.startTime} - {item.endTime}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-around items-center gap-2 text-sm">
        <p
          className={`w-20 border-[1px] flex justify-center items-center rounded-md p-1 ${
            item.priority === "high"
              ? "bg-red-300"
              : item.priority === "Medium"
              ? "border-violet-300"
              : "border-yellow-300"
          }`}
        >
          {item.priority}
        </p>
        <Select
          defaultValue={item.status}
          style={{ width: 120 }}
          options={[
            { value: "Todo", label: "Todo" },
            { value: "Inprogress", label: "Inprogress" },
            { value: "Done", label: "Done" },
          ]}
          onChange={(value) => handleBlur(item._id, "status", value)}
        />
        <UpdateTask todayTodo={item} />
      </div>
    </div>
  );
}

export default TodoItem;