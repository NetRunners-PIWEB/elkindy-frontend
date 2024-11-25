import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { assignTeachersToClass ,fetchClassById, fetchSessionsByClassId} from "../../services/class/classService";
import { fetchAssignedTeachers} from "../../services/course/courseService";
import TeacherProfile from "./components/TeacherProfile";
import GenerateSessionPanel from "./components/GenerateSessionPanel";
const ClassConfigPage = () => {
    const { courseId, classId } = useParams();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [assignedTeacherIds, setAssignedTeacherIds] = useState([]);
    const [classDetail, setClassDetail] = useState({});

    const [showGenerateSessionPanel, setShowGenerateSessionPanel] = useState(false);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedClass = await fetchClassById(classId);
            setClassDetail(fetchedClass);
            if (fetchedClass && Array.isArray(fetchedClass.teacher)) {
                setAssignedTeacherIds(fetchedClass.teacher.map(t => t._id));
            }

            const fetchedSessions = await fetchSessionsByClassId(classId);
            if (fetchedSessions ) {
                setSessions(fetchedSessions);
            }

            const fetchedTeachers = await fetchAssignedTeachers(courseId);
            if (fetchedTeachers) {
                setTeachers(fetchedTeachers);
            }
        };
        fetchData();
    }, [classId, courseId]);

    const handleAssignTeacher = (teacherId) => {
        if (!assignedTeacherIds.includes(teacherId)) {
            setAssignedTeacherIds([...assignedTeacherIds, teacherId]);
        }
    };

    const handleUnassignTeacher = (teacherId) => {
        setAssignedTeacherIds(assignedTeacherIds.filter(id => id !== teacherId));
    };

    const handleSave = async () => {
        try {
            await assignTeachersToClass(classId, assignedTeacherIds);
            //navigate(-1); // Navigate back after saving
        } catch (error) {
            console.error('Failed to assign teachers:', error);
        }
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'teacher',
        drop: (item) => handleAssignTeacher(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const toggleGenerateSessionPanel = async () => {
        setShowGenerateSessionPanel(!showGenerateSessionPanel);
        const fetchedSessions = await fetchSessionsByClassId(classId);
        if (fetchedSessions) {
            setSessions(fetchedSessions);
        }
    };



    return (
        <div className="container mx-auto p-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Assign Teachers to Classes</h2>
                <button onClick={() => navigate(-1)}
                        className="mt-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                    Go Back
                </button>
            </div>
            <div className="flex flex-col md:flex-row sm:flex-row mt-8">
                <div
                    className="scrollbar-styled flex flex-col mr-6 md:mr-6 mb-4 sm:mb-0 w-full md:w-1/4 p-4 bg-gray-500 rounded-xl gap-y-4 overflow-y-auto max-h-96">
                    <h2 className="text-gray-800 text-xl">Available Teachers</h2>
                    {teachers.map((teacher) => (
                        <TeacherProfile key={teacher._id} teacher={teacher} handleAssignTeacher={handleAssignTeacher}/>
                    ))}
                </div>
                <div className="w-1/4 p-4 mr-6 md:mr-4 sm:mr-0 bg-gray-500 rounded-xl flex flex-col gap-y-4 " ref={drop}
                     style={{minHeight: '100px', backgroundColor: isOver ? 'lightgreen' : 'lightgrey'}}>
                    <h2 className="text-gray-800 text-xl">Assigned Teachers</h2>
                    {assignedTeacherIds.map(id => {
                        const teacher = teachers.find(t => t._id === id);
                        return teacher ? (
                            <div
                                className="flex items-center justify-between px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer"
                                key={id}>
                                <h1 className="text-gray-800 text-xl">{teacher.username}</h1>
                                <button className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
                                        onClick={() => handleUnassignTeacher(id)}>Unassign
                                </button>
                            </div>
                        ) : null;
                    })}
                </div>
                <div className="container w-2/4 mx-auto p-4">
                    <div className=" bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="bg-gray-200 text-gray-800 text-xl font-semibold p-4">Course Details</div>
                        <div className="p-4">
                            <h2 className="text-gray-800 text-lg font-bold">{classDetail.name}</h2>
                            <p className="text-gray-600">{classDetail.name}</p>
                            <div className="mt-4">
                                <div className="text-gray-700 font-semibold">Category: <span
                                    className="font-normal">{classDetail.name}</span></div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleSave}>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={toggleGenerateSessionPanel}
                    className="bg-kindydarkblue hover:bg-kindyblue text-white mx-auto mt-4 font-bold py-2 px-4 rounded">
                Generate Session
            </button>

            <div className="container mx-auto p-4 w-full flex flex-row items-start space-x-4">
                <div className="flex-1 lg rounded-lg overflow-hidden">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Class Sessions</h3>
                    {sessions.length > 0 ? (
                        <div className="flex flex-wrap -m-4 overflow-auto">
                            {sessions.map((session, index) => (
                                <div key={index} className="p-4 md:w-1/2">
                                    <div
                                        className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
                                        <div className="p-6">
                                            <h2 className="title-font text-lg font-medium text-gray-900 dark:text-white mb-3">{session.classId.name} -
                                                Room: {session.room}</h2>
                                            <p className="leading-relaxed mb-3">Date: {new Date(session.date).toLocaleDateString()} |
                                                Start: {new Date(session.startTime).toLocaleTimeString()} -
                                                End: {new Date(session.endTime).toLocaleTimeString()}</p>
                                            <p className="leading-relaxed text-gray-600 dark:text-gray-400">Teacher: {session.teacher.username}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No sessions found for this class.</p>
                    )}
                </div>
                {showGenerateSessionPanel &&
                    <GenerateSessionPanel classId={classId} onClose={toggleGenerateSessionPanel}/>}

            </div>

        </div>
    )
        ;
};

export default ClassConfigPage;
