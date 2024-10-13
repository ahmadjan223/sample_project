
//code from sidenav..js for shwoing user info

    <>
      {showDetailsPage ? (

        <FieldDetails
        fieldName={selectedFieldName}
        polygonInfo={polygonInfo}
        goBackToSidebar={goBackToSidebar} // Pass the back function to FieldDetails
        />
      ) : (
        <div className="sidenav-container">
          {/* User Info */}
          <div className="user-info">
            {user.image && (
              <img
                src={user.image}
                alt={`${user.displayName}'s profile`}
                className="user-image"
              />
            )}
            <div className="user-name">{user.displayName}</div>
            <i className="material-icons logout-icon" onClick={handleLogout}>
              logout
            </i>
          </div>

          {/* Field List */}
          <div className="field-container">
            {polygonInfo.map((field) => (
              <SideBarTiles
                key={field.name}
                field={field}
                selectedFieldName={selectedFieldName}
                openDetailsPage={openDetailsPage} // Pass the function to open details
              />
            ))}
          </div>
        </div>
      )}
    </>