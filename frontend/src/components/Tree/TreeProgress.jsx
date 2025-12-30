import React from 'react';
import { Gift, Star, Sparkles, TrendingUp } from 'lucide-react';
import './TreeProgress.css';

const TreeProgress = ({ progress, treeLevel }) => {
  if (!progress) return null;

  const { total_acts, total_decorations, next_milestone } = progress;
  const progressPercentage = next_milestone
    ? Math.min(100, (total_acts / next_milestone.milestone_acts) * 100)
    : 100;

  return (
    <div className="tree-progress-container">
      <div className="progress-header">
        <div className="progress-title">
          <Sparkles size={20} />
          <h3>Your Tree Progress</h3>
        </div>
        <div className="tree-level-badge">
          <Star size={16} />
          <span>Level {treeLevel}</span>
        </div>
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <Gift size={18} />
          <div className="stat-content">
            <div className="stat-value">{total_acts}</div>
            <div className="stat-label">Acts of Kindness</div>
          </div>
        </div>
        <div className="stat-item">
          <Sparkles size={18} />
          <div className="stat-content">
            <div className="stat-value">{total_decorations}</div>
            <div className="stat-label">Decorations</div>
          </div>
        </div>
      </div>

      {next_milestone && (
        <div className="milestone-section">
          <div className="milestone-header">
            <TrendingUp size={16} />
            <span>Next Milestone</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="progress-text">
              <span>{total_acts} / {next_milestone.milestone_acts} acts</span>
              <span className="milestone-reward">{next_milestone.reward}</span>
            </div>
          </div>
          <div className="milestone-info">
            <span className="acts-needed">
              {next_milestone.acts_needed} more act{next_milestone.acts_needed !== 1 ? 's' : ''} to unlock {next_milestone.reward}!
            </span>
          </div>
        </div>
      )}

      {!next_milestone && (
        <div className="milestone-complete">
          <Star size={24} />
          <p>Congratulations! You've reached all milestones! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default TreeProgress;

