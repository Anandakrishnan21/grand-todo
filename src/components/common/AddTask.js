"use client";
import React, { useState } from "react";
import {
  DatePicker,
  FloatButton,
  Form,
  message,
  Modal,
  Select,
  TimePicker,
} from "antd";
import Link from "next/link";
import Input from "antd/es/input/Input";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from "next/navigation";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";
dayjs.extend(customParseFormat);

const AddTask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const format = "HH:mm";
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    form.resetFields();
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const onTimeChange = (times) => {
    setSelectedTimeRange(times);
  };

  const handleSubmit = async (values) => {
    const { description, tags, assignee, priority } = values;
    const dueDate = selectedDate ? selectedDate.format("DD-MM-YYYY") : null;
    const startTime = selectedTimeRange
      ? selectedTimeRange[0].format("HH:mm")
      : null;
    const endTime = selectedTimeRange
      ? selectedTimeRange[1].format("HH:mm")
      : null;

    try {
      const res = await fetch("/api/today", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          tags: tags ? tags.join(" ") : "",
          date: dueDate,
          assignee,
          priority,
          startTime: startTime,
          endTime: endTime,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        router.push("/today");
        form.resetFields();
        message.success("Task added successfully!");
      } else {
        const data = await res.json();
        message.error(data.message || "Failed to add task!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error submitting form. Please try again.");
    }
  };

  const options = [
    { label: "#Food", value: "#Food" },
    { label: "#study", value: "#study" },
    { label: "#sleep", value: "#sleep" },
    { label: "#workout", value: "#workout" },
    { label: "#work", value: "#work" },
    { label: "#practice", value: "#practice" },
    { label: "#happy", value: "#happy" },
  ];

  return (
    <>
      <Link
        href="#"
        className="hidden lg:flex items-start font-bold text-sm text-blue-800 gap-4 p-2"
        onClick={showModal}
      >
        <AiOutlinePlusCircle size={20} />
        Add Todo
      </Link>
      <FloatButton icon={<AiOutlinePlusCircle />} onClick={showModal} />
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            assignee: session?.user?.name,
            priority: "Low",
          }}
        >
          <div className="flex flex-col gap-2 p-3">
            <Form.Item
              name="description"
              rules={[{ required: true, message: "Enter the description!" }]}
            >
              <div>
                <p>Description</p>
                <Input id="task" name="task" placeholder="Task name" />
              </div>
            </Form.Item>

            <Form.Item name="tags">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="select tags"
                options={options}
              />
            </Form.Item>

            <div className="grid grid-cols-2 lg:grid-cols-4 justify-between gap-2">
              <Form.Item
                name="date"
                rules={[{ required: true, message: "Select the date!" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onDateChange}
                  value={selectedDate ? dayjs(selectedDate) : null}
                />
              </Form.Item>

              <Form.Item
                name="assignee"
                rules={[{ required: true, message: "Select an assignee!" }]}
              >
                <Select />
              </Form.Item>

              <Form.Item
                name="priority"
                rules={[{ required: true, message: "Select a priority!" }]}
              >
                <Select
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="time"
                rules={[{ required: true, message: "Select a time!" }]}
              >
                <TimePicker.RangePicker
                  style={{ width: "100%" }}
                  onChange={onTimeChange}
                  value={selectedTimeRange}
                  format={format}
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-3">
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 px-2 rounded-md border-[1px] hover:border-blue-400 border-gray-200 active:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-shadow duration-300 ease-in-out transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-1 px-2 rounded-md bg-blue-400 text-white active:shadow-[0_3px_10px_rgba(59,130,246,0.5)] transition-shadow duration-300 ease-in-out transform"
            >
              Submit
            </button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddTask;
