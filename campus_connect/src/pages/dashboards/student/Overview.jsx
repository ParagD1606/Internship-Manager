import React from 'react';
import StatsGrid from './StatsGrid';
import RecentApplications from './RecentApplications';
import RecommendedJobs from './RecommendedJobs';

const Overview = ({ setActiveTab }) => {
  return (
    <div style={styles.container}>
      {/* 1. Stats Row - clickable to navigate */}
      <StatsGrid setActiveTab={setActiveTab} />

      {/* 2. Content Split */}
      <div style={styles.contentSplit}>
        
        {/* Left: Table - View All goes to Applications */}
        <RecentApplications onViewAll={() => setActiveTab('Applications')} />

        {/* Right: Recommendations - Clicks go to Opportunities */}
        <RecommendedJobs onJobClick={() => setActiveTab('Opportunities')} />
        
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', margin: '0 auto' },
  contentSplit: { display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }
};

export default Overview;