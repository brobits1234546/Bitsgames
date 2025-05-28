import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Trophy, Users, Calendar, ArrowLeft, PlayCircle, 
  Check, AlertTriangle, ChevronDown, User, Plus 
} from 'lucide-react';
import { format } from 'date-fns';

const TournamentDetailsPage = () => {
  // [Previous code remains unchanged until the end]
};

export default TournamentDetailsPage;