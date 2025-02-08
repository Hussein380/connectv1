import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20"
        >
            <div className="flex items-center gap-3">
                <div className="text-blue-400">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-blue-100">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard; 