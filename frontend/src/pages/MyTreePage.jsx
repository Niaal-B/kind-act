import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PublicNavigationSidebar from '../components/Navigation/PublicNavigationSidebar';
import { treeAPI } from '../services/api';
import TreeCanvas from '../components/Tree/TreeCanvas';
import TreeProgress from '../components/Tree/TreeProgress';
import { Sparkles, RefreshCw, Share2, Gift, Edit2, Save, X, Download, Image as ImageIcon } from 'lucide-react';
import { exportTreeAsImage, downloadTreeImage, shareTreeImage } from '../utils/treeExport';
import './MyTreePage.css';

const MyTreePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempDecorations, setTempDecorations] = useState([]);
  const [originalDecorations, setOriginalDecorations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const treeCanvasRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTree();
    }
  }, [isAuthenticated]);

  const fetchTree = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await treeAPI.getMyTree();
      setTreeData(response.data);
    } catch (err) {
      console.error('Error fetching tree:', err);
      setError('Failed to load your tree. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTree();
  };

  const handleExportTree = async () => {
    if (!treeCanvasRef.current || !treeData) {
      alert('Tree not loaded yet. Please wait...');
      return;
    }

    setIsExporting(true);
    try {
      const treeElement = treeCanvasRef.current.getElement();
      if (!treeElement) {
        throw new Error('Tree element not found');
      }

      // Capture the entire tree-canvas-container to preserve all positioning
      const elementToCapture = treeElement;

      // Export tree as image
      const blob = await exportTreeAsImage(elementToCapture, treeData, user?.username || 'User');
      
      // Download the image
      downloadTreeImage(blob, `${user?.username || 'my'}-christmas-tree.png`);
      
      alert('Tree image downloaded successfully! 🎄');
    } catch (error) {
      console.error('Error exporting tree:', error);
      alert('Failed to export tree. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!treeCanvasRef.current || !treeData) {
      // Fallback to URL sharing if tree not ready
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Christmas Tree of Kindness",
            text: `Check out my tree with ${treeData?.total_decorations || 0} decorations!`,
            url: window.location.href,
          });
        } catch {
          console.log('Share cancelled');
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
      return;
    }

    setIsExporting(true);
    try {
      const treeElement = treeCanvasRef.current.getElement();
      if (!treeElement) {
        throw new Error('Tree element not found');
      }

      // Capture the entire tree-canvas-container to preserve all positioning
      const elementToCapture = treeElement;

      // Export tree as image
      const blob = await exportTreeAsImage(elementToCapture, treeData, user?.username || 'User');
      
      // Share the image
      const shareText = `Check out my Christmas Tree of Kindness! 🎄\n${treeData?.total_acts || 0} acts of kindness • ${treeData?.total_decorations || 0} decorations • Level ${treeData?.tree_level || 1}`;
      await shareTreeImage(blob, shareText);
    } catch (error) {
      console.error('Error sharing tree:', error);
      // Fallback to URL sharing
      if (navigator.share) {
        try {
          await navigator.share({
            title: "My Christmas Tree of Kindness",
            text: `Check out my tree with ${treeData?.total_decorations || 0} decorations!`,
            url: window.location.href,
          });
        } catch {
          console.log('Share cancelled');
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditModeToggle = () => {
    if (!isEditMode) {
      setOriginalDecorations([...treeData.decorations]);
      setTempDecorations([...treeData.decorations]);
    } else {
      setTempDecorations([...originalDecorations]);
    }
    setIsEditMode(!isEditMode);
  };

  const handleDecorationPositionChange = (decorationId, newPosition) => {
    if (isEditMode) {
      setTempDecorations(prev => 
        prev.map(dec => 
          dec.id === decorationId 
            ? { ...dec, position_x: newPosition.x, position_y: newPosition.y }
            : dec
        )
      );
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatePromises = tempDecorations.map(decoration => {
        const original = originalDecorations.find(o => o.id === decoration.id);
        if (
          original &&
          (original.position_x !== decoration.position_x || 
           original.position_y !== decoration.position_y)
        ) {
          return treeAPI.updateDecoration(decoration.id, {
            position_x: decoration.position_x,
            position_y: decoration.position_y,
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      await fetchTree();
      setIsEditMode(false);
      setTempDecorations([]);
      setOriginalDecorations([]);
    } catch (error) {
      console.error('Error saving decorations:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempDecorations([...originalDecorations]);
    setIsEditMode(false);
    setTempDecorations([]);
    setOriginalDecorations([]);
  };

  const handleDecorationUpdate = async (decorationId, newPosition) => {
    if (!isEditMode) {
      try {
        await treeAPI.updateDecoration(decorationId, {
          position_x: newPosition.x,
          position_y: newPosition.y,
        });
        await fetchTree();
      } catch (error) {
        console.error('Error updating decoration:', error);
      }
    }
  };

  const handleDecorationClick = (decoration) => {
    console.log('Decoration clicked:', decoration);
  };

  if (loading) {
    return (
      <div className="my-tree-page">
        <PublicNavigationSidebar />
        <div className="my-tree-content">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading your tree...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tree-page">
        <PublicNavigationSidebar />
        <div className="my-tree-content">
          <div className="error-card card">
            <div className="error-content">
              <p className="error-message">{error}</p>
              <button onClick={fetchTree} className="btn-primary">
                <RefreshCw className="button-icon" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="my-tree-page">
        <PublicNavigationSidebar />
        <div className="my-tree-content">
          <div className="empty-card card">
            <div className="empty-content">
              <Gift className="empty-icon" />
              <h2>Start Your Tree!</h2>
              <p>
                Submit your first act of kindness to begin decorating your tree.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const decorationsToDisplay = isEditMode ? tempDecorations : (treeData?.decorations || []);

  return (
    <div className="my-tree-page">
      <PublicNavigationSidebar />
      <div className={`my-tree-content ${isEditMode ? 'edit-mode' : ''}`}>
        <div className="my-tree-container">
          <div className="tree-header-card card">
            <div className="tree-header">
              <div className="tree-header-left">
                <Sparkles className="tree-header-icon" />
                <div className="tree-header-text">
                  <h1 className="tree-title">{user?.username}'s Christmas Tree</h1>
                  <p className="tree-subtitle">
                    {isEditMode 
                      ? 'Drag decorations to rearrange, then click Save to apply changes' 
                      : 'Your acts of kindness bring this tree to life'}
                  </p>
                </div>
              </div>
              <div className="tree-header-actions">
                {isEditMode ? (
                  <>
                    <button onClick={handleSaveChanges} className="btn-primary btn-save" disabled={isSaving}>
                      <Save className="button-icon" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancelEdit} className="btn-cancel" disabled={isSaving}>
                      <X className="button-icon" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEditModeToggle} className="btn-secondary btn-edit">
                      <Edit2 className="button-icon" />
                      Edit
                    </button>
                    <button 
                      onClick={handleExportTree} 
                      className="btn-secondary btn-export" 
                      title="Download Tree Image"
                      disabled={isExporting}
                    >
                      <Download className="button-icon" />
                      {isExporting ? 'Exporting...' : 'Download'}
                    </button>
                    <button onClick={handleRefresh} className="btn-icon" title="Refresh">
                      <RefreshCw className="icon" />
                    </button>
                    <button 
                      onClick={handleShare} 
                      className="btn-icon" 
                      title="Share Tree"
                      disabled={isExporting}
                    >
                      <Share2 className="icon" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="tree-layout">
            <div className="tree-canvas-section">
              <div className={`tree-canvas-card card ${isEditMode ? 'edit-mode-border' : ''}`}>
                <div className="tree-canvas-wrapper">
                  <TreeCanvas
                    ref={treeCanvasRef}
                    decorations={decorationsToDisplay}
                    treeLevel={treeData?.tree_level || 1}
                    isInteractive={true}
                    editMode={isEditMode}
                    onDecorationClick={handleDecorationClick}
                    onDecorationUpdate={handleDecorationUpdate}
                    onDecorationPositionChange={handleDecorationPositionChange}
                  />
                </div>
              </div>
            </div>

            <div className="tree-progress-section">
              <TreeProgress
                progress={treeData?.progress}
                treeLevel={treeData?.tree_level}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTreePage;
