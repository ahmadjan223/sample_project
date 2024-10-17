
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


//code from dahsboard::

{/* <div style={{ display: "flex" }}>
      <div>
        
      </div>
      <SideNav
        polygons={polygons}
        isLoaded={isLoaded}
        user={user}
        resetDB={() => resetDB(user.id)}
        sendToDb={() => {
          sendToDb(polygons);
        }}
        clearMap={clearMap}
        selectedFieldName={selectedFieldName}
        setSelectedFieldName={(name) => {
          setSelectedFieldName(name);
        }}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        DataFetch={DataFetch}
      />
      {isLoading && ( // Add a condition to show the loader
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with transparency
            zIndex: 999, // Ensure it's above all other elements
            display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
          }}
        >
          <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="three-circles-loading"
          />
        </div>
      )}
      <div style={{ flex: 1, flexDirection: "row" }}>
        <div
          className="map-container"
          style={{ flex: 1, position: "relative" }}
        >
          {isLoaded && (
            <Maps
              user={user}
              polygons={polygons}
              DataFetch={DataFetch}
              polygonLayer={polygonLayer}
        
              selectedFieldName={selectedFieldName}
              date={date}
              layer={layer}
              setIsLoading={setIsLoading}
              indexValues = {indexValues}
              isDrawing={isDrawing}
              setIsDrawing={setIsDrawing}
            ></Maps>
          )}
        </div>
        <div>
          {selectedFieldName && (<BottomBar
            date={date}
            layer={layer}
            setDate={setDate}
            setLayer={setLayer}
            selectedFieldName={selectedFieldName}
          ></BottomBar>)}
        </div>
      </div>
    </div> */}